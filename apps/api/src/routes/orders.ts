import { Router } from 'express';
import { z } from 'zod';

import { requireCustomer } from '../lib/auth';
import { prisma } from '../lib/prisma';

const createOrderSchema = z
  .object({
    type: z.enum(['PRODUCT_ORDER', 'PRESCRIPTION_REQUEST']),
    customer: z.object({
      name: z.string().min(2),
      phone: z.string().min(8),
      address: z.string().min(5),
    }),
    items: z
      .array(
        z.object({
          productId: z.string().min(1),
          productUnitId: z.string().min(1).optional(),
          quantity: z.number().int().positive(),
        }),
      )
      .default([]),
    prescriptionUploadIds: z.array(z.string().min(1)).default([]),
    checkout: z
      .object({
        fulfillmentMethod: z.enum(['DELIVERY', 'PICKUP']).default('DELIVERY'),
        deliveryDate: z.string().min(1).optional(),
        deliveryTimeSlot: z.string().min(1).optional(),
        paymentMethod: z
          .enum(['ONLINE', 'CASH_ON_DELIVERY', 'CARD_ON_DELIVERY'])
          .default('CASH_ON_DELIVERY'),
        confirmByCall: z.boolean().default(false),
        deliveryFeePiasters: z.number().int().nonnegative().default(0),
      })
      .default({
        confirmByCall: false,
        deliveryFeePiasters: 0,
        fulfillmentMethod: 'DELIVERY',
        paymentMethod: 'CASH_ON_DELIVERY',
      }),
    notes: z.string().optional(),
  })
  .refine((data) => {
    if (data.type === 'PRODUCT_ORDER') {
      return data.items.length > 0 && data.prescriptionUploadIds.length === 0;
    }

    return data.prescriptionUploadIds.length > 0 && data.items.length === 0;
  }, 'Product orders require products only; prescription requests require prescriptions only');

export const ordersRouter = Router();

ordersRouter.get('/', async (request, response, next) => {
  try {
    const customer = await requireCustomer(request, response);

    if (!customer) {
      return;
    }

    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              include: {
                units: true,
              },
            },
            productUnit: true,
          },
        },
        prescriptions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        customerId: customer.id,
      },
    });

    response.json({ data: orders });
  } catch (error) {
    next(error);
  }
});

ordersRouter.get('/:id', async (request, response, next) => {
  try {
    const customer = await requireCustomer(request, response);

    if (!customer) {
      return;
    }

    const order = await prisma.order.findFirst({
      where: {
        customerId: customer.id,
        id: request.params.id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                units: true,
              },
            },
            productUnit: true,
          },
        },
        prescriptions: true,
      },
    });

    if (!order) {
      response.status(404).json({
        error: 'Order not found',
      });
      return;
    }

    response.json({ data: order });
  } catch (error) {
    next(error);
  }
});

ordersRouter.post('/', async (request, response, next) => {
  try {
    const customer = await requireCustomer(request, response);

    if (!customer) {
      return;
    }

    const parsed = createOrderSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        error: 'Invalid order request',
        details: parsed.error.flatten(),
      });
      return;
    }

    const productIds = [...new Set(parsed.data.items.map((item) => item.productId))];
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      response.status(400).json({
        error: 'One or more products were not found',
      });
      return;
    }

    const productById = new Map(products.map((product) => [product.id, product]));
    const productUnitIds = parsed.data.items
      .map((item) => item.productUnitId)
      .filter((productUnitId): productUnitId is string => Boolean(productUnitId));
    const selectedUnits = productUnitIds.length
      ? await prisma.productUnit.findMany({
          where: {
            id: {
              in: productUnitIds,
            },
          },
        })
      : [];
    const defaultUnits = await prisma.productUnit.findMany({
      where: {
        productId: {
          in: productIds,
        },
        isDefault: true,
      },
    });
    const unitById = new Map(selectedUnits.map((unit) => [unit.id, unit]));
    const defaultUnitByProductId = new Map(defaultUnits.map((unit) => [unit.productId, unit]));

    const hasInvalidUnit = parsed.data.items.some((item) => {
      if (!item.productUnitId) {
        return false;
      }

      const unit = unitById.get(item.productUnitId);

      return !unit || unit.productId !== item.productId;
    });

    if (hasInvalidUnit) {
      response.status(400).json({
        error: 'One or more product units were not found',
      });
      return;
    }

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        type: parsed.data.type,
        customerName: customer.fullName,
        customerPhone: customer.phone,
        address: parsed.data.customer.address,
        fulfillmentMethod: parsed.data.checkout.fulfillmentMethod,
        deliveryDate: parsed.data.checkout.deliveryDate,
        deliveryTimeSlot: parsed.data.checkout.deliveryTimeSlot,
        paymentMethod: parsed.data.checkout.paymentMethod,
        pricingStatus: parsed.data.type === 'PRESCRIPTION_REQUEST' ? 'PENDING_REVIEW' : 'NOT_REQUIRED',
        confirmByCall: parsed.data.checkout.confirmByCall,
        deliveryFeePiasters: parsed.data.checkout.deliveryFeePiasters,
        notes: parsed.data.notes,
        status: parsed.data.type === 'PRESCRIPTION_REQUEST' ? 'PENDING_REVIEW' : 'RECEIVED',
        items: {
          create: parsed.data.items.map((item) => {
            const product = productById.get(item.productId);
            const productUnit = item.productUnitId
              ? unitById.get(item.productUnitId)
              : defaultUnitByProductId.get(item.productId);

            if (!product) {
              throw new Error(`Product ${item.productId} disappeared during order creation`);
            }

            return {
              productId: item.productId,
              productUnitId: productUnit?.id ?? null,
              quantity: item.quantity,
              pricePiasters: productUnit?.pricePiasters ?? product.pricePiasters,
              unitLabel: productUnit?.label ?? null,
            };
          }),
        },
        prescriptions: {
          connect: parsed.data.prescriptionUploadIds.map((id) => ({ id })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                units: true,
              },
            },
            productUnit: true,
          },
        },
        prescriptions: true,
      },
    });

    response.status(201).json({
      data: order,
    });
  } catch (error) {
    next(error);
  }
});
