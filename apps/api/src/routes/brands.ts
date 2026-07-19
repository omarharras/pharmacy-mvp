import { Router } from 'express';

import { prisma } from '../lib/prisma';

export const brandsRouter = Router();

brandsRouter.get('/', async (_request, response, next) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: [
        {
          isFeatured: 'desc',
        },
        {
          sortOrder: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });

    response.json({ data: brands });
  } catch (error) {
    next(error);
  }
});
