import { Router } from 'express';

import { prisma } from '../lib/prisma';

export const categoriesRouter = Router();

categoriesRouter.get('/', async (_request, response, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });

    response.json({ data: categories });
  } catch (error) {
    next(error);
  }
});
