import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../lib/prisma';

const addressSchema = z.object({
  addressName: z.string().min(1),
  additionalPhone: z.string().optional(),
  apartment: z.string().optional(),
  area: z.string().min(2),
  building: z.string().min(1),
  city: z.string().min(2),
  floor: z.string().optional(),
  fullName: z.string().min(2),
  isDefault: z.boolean().default(false),
  landmark: z.string().optional(),
  phone: z.string().min(8),
  street: z.string().min(2),
});

export const addressesRouter = Router();

addressesRouter.get('/', async (_request, response, next) => {
  try {
    const addresses = await prisma.address.findMany({
      orderBy: [
        {
          isDefault: 'desc',
        },
        {
          updatedAt: 'desc',
        },
      ],
    });

    response.json({ data: addresses });
  } catch (error) {
    next(error);
  }
});

addressesRouter.get('/:id', async (request, response, next) => {
  try {
    const address = await prisma.address.findUnique({
      where: {
        id: request.params.id,
      },
    });

    if (!address) {
      response.status(404).json({
        error: 'Address not found',
      });
      return;
    }

    response.json({ data: address });
  } catch (error) {
    next(error);
  }
});

addressesRouter.post('/', async (request, response, next) => {
  try {
    const parsed = addressSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        error: 'Invalid address request',
        details: parsed.error.flatten(),
      });
      return;
    }

    const shouldBeDefault = parsed.data.isDefault || (await prisma.address.count()) === 0;

    if (shouldBeDefault) {
      await prisma.address.updateMany({
        data: {
          isDefault: false,
        },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...parsed.data,
        isDefault: shouldBeDefault,
      },
    });

    response.status(201).json({ data: address });
  } catch (error) {
    next(error);
  }
});

addressesRouter.put('/:id', async (request, response, next) => {
  try {
    const parsed = addressSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        error: 'Invalid address request',
        details: parsed.error.flatten(),
      });
      return;
    }

    const existingAddress = await prisma.address.findUnique({
      where: {
        id: request.params.id,
      },
    });

    if (!existingAddress) {
      response.status(404).json({
        error: 'Address not found',
      });
      return;
    }

    if (parsed.data.isDefault) {
      await prisma.address.updateMany({
        data: {
          isDefault: false,
        },
      });
    }

    const address = await prisma.address.update({
      data: parsed.data,
      where: {
        id: request.params.id,
      },
    });

    response.json({ data: address });
  } catch (error) {
    next(error);
  }
});
