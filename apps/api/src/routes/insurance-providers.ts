import { Router } from 'express';

import { prisma } from '../lib/prisma';

export const insuranceProvidersRouter = Router();

insuranceProvidersRouter.get('/', async (_request, response, next) => {
  try {
    const providers = await prisma.insuranceProvider.findMany({
      orderBy: [
        {
          sortOrder: 'asc',
        },
        {
          name: 'asc',
        },
      ],
      where: {
        isActive: true,
      },
    });

    response.json({ data: providers });
  } catch (error) {
    next(error);
  }
});
