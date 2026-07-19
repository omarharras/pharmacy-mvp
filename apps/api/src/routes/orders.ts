import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../lib/prisma';

const createOrderSchema = z
  .object({
    customer: z.object({
      name: z.string().min(2),
      phone: z.string().min(8),
      address: z.string().min(5),
    }),
    items: z
      .array(
        z.object({
          productId: z.string().min(1),
          quantity: z.number().int().positive(),
        }),
      )
      .default([]),
    prescriptionUploadIds: z.array(z.string().min(1)).default([]),
    notes: z.string().optional(),
  })
  .refine(
    (data) => data.items.length > 0 || data.prescriptionUploadIds.length > 0,
    'Add at least one product or prescription',
  );

export const ordersRouter = Router();

ordersRouter.get('/', async (_request, response, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        prescriptions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    response.json({ data: orders });
  } catch (error) {
    next(error);
  }
});

ordersRouter.get('/:id', async (request, response, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: request.params.id,
      },
      include: {
        items: {
          include: {
            product: true,
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
    const parsed = createOrderSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        error: 'Invalid order request',
        details: parsed.error.flatten(),
      });
      return;
    }

    const productIds = parsed.data.items.map((item) => item.productId);
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

    const order = await prisma.order.create({
      data: {
        customerName: parsed.data.customer.name,
        customerPhone: parsed.data.customer.phone,
        address: parsed.data.customer.address,
        notes: parsed.data.notes,
        items: {
          create: parsed.data.items.map((item) => {
            const product = productById.get(item.productId);

            if (!product) {
              throw new Error(`Product ${item.productId} disappeared during order creation`);
            }

            return {
              productId: item.productId,
              quantity: item.quantity,
              pricePiasters: product.pricePiasters,
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
            product: true,
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
