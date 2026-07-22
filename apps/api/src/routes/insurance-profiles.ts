import { Router } from 'express';
import { z } from 'zod';

import { requireCustomer } from '../lib/auth';
import { prisma } from '../lib/prisma';

const insuranceProfileSchema = z.object({
  backImageUrl: z.string().optional(),
  cardholderName: z.string().min(2),
  frontImageUrl: z.string().optional(),
  memberNumber: z.string().min(3),
  nationalIdBackImageUrl: z.string().optional(),
  nationalIdFrontImageUrl: z.string().optional(),
  providerName: z.string().min(2),
  useByDefault: z.boolean().default(false),
});

export const insuranceProfilesRouter = Router();

insuranceProfilesRouter.get('/', async (request, response, next) => {
  try {
    const customer = await requireCustomer(request, response);

    if (!customer) {
      return;
    }

    const profiles = await prisma.insuranceProfile.findMany({
      orderBy: [
        {
          useByDefault: 'desc',
        },
        {
          updatedAt: 'desc',
        },
      ],
      where: {
        customerId: customer.id,
      },
    });

    response.json({ data: profiles });
  } catch (error) {
    next(error);
  }
});

insuranceProfilesRouter.post('/', async (request, response, next) => {
  try {
    const customer = await requireCustomer(request, response);

    if (!customer) {
      return;
    }

    const parsed = insuranceProfileSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        details: parsed.error.flatten(),
        error: 'Invalid insurance profile request',
      });
      return;
    }

    const shouldUseByDefault =
      parsed.data.useByDefault ||
      (await prisma.insuranceProfile.count({
        where: {
          customerId: customer.id,
        },
      })) === 0;

    if (shouldUseByDefault) {
      await prisma.insuranceProfile.updateMany({
        data: {
          useByDefault: false,
        },
        where: {
          customerId: customer.id,
        },
      });
    }

    const profile = await prisma.insuranceProfile.create({
      data: {
        ...parsed.data,
        customerId: customer.id,
        status: 'PENDING_REVIEW',
        useByDefault: shouldUseByDefault,
      },
    });

    response.status(201).json({ data: profile });
  } catch (error) {
    next(error);
  }
});

insuranceProfilesRouter.put('/:id/default', async (request, response, next) => {
  try {
    const customer = await requireCustomer(request, response);

    if (!customer) {
      return;
    }

    const existingProfile = await prisma.insuranceProfile.findFirst({
      where: {
        customerId: customer.id,
        id: request.params.id,
      },
    });

    if (!existingProfile) {
      response.status(404).json({
        error: 'Insurance profile not found',
      });
      return;
    }

    await prisma.insuranceProfile.updateMany({
      data: {
        useByDefault: false,
      },
      where: {
        customerId: customer.id,
      },
    });

    const profile = await prisma.insuranceProfile.update({
      data: {
        useByDefault: true,
      },
      where: {
        id: existingProfile.id,
      },
    });

    response.json({ data: profile });
  } catch (error) {
    next(error);
  }
});

insuranceProfilesRouter.delete('/:id', async (request, response, next) => {
  try {
    const customer = await requireCustomer(request, response);

    if (!customer) {
      return;
    }

    const existingProfile = await prisma.insuranceProfile.findFirst({
      where: {
        customerId: customer.id,
        id: request.params.id,
      },
    });

    if (!existingProfile) {
      response.status(404).json({
        error: 'Insurance profile not found',
      });
      return;
    }

    await prisma.insuranceProfile.delete({
      where: {
        id: existingProfile.id,
      },
    });

    const fallbackProfile = await prisma.insuranceProfile.findFirst({
      orderBy: {
        updatedAt: 'desc',
      },
      where: {
        customerId: customer.id,
      },
    });

    if (existingProfile.useByDefault && fallbackProfile) {
      await prisma.insuranceProfile.update({
        data: {
          useByDefault: true,
        },
        where: {
          id: fallbackProfile.id,
        },
      });
    }

    response.json({
      data: {
        deleted: true,
      },
    });
  } catch (error) {
    next(error);
  }
});
