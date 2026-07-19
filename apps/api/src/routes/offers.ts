import { Router } from 'express';

import { prisma } from '../lib/prisma';

export const offersRouter = Router();

offersRouter.get('/', async (_request, response, next) => {
  try {
    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    response.json({ data: offers });
  } catch (error) {
    next(error);
  }
});
