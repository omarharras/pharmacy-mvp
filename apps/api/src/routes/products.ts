import { Router } from 'express';

import { formatPiasters } from '../lib/money';
import { prisma } from '../lib/prisma';

export const productsRouter = Router();

productsRouter.get('/', async (request, response, next) => {
  try {
    const query = typeof request.query.query === 'string' ? request.query.query : undefined;
    const categoryId =
      typeof request.query.categoryId === 'string' ? request.query.categoryId : undefined;
    const brandId = typeof request.query.brandId === 'string' ? request.query.brandId : undefined;

    const products = await prisma.product.findMany({
      where: {
        brandId,
        categoryId,
        ...(query
          ? {
              OR: [
                {
                  name: {
                    contains: query,
                  },
                },
                {
                  description: {
                    contains: query,
                  },
                },
                {
                  brand: {
                    name: {
                      contains: query,
                    },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        brand: true,
        category: true,
      },
      orderBy: [
        {
          isPopular: 'desc',
        },
        {
          name: 'asc',
        },
      ],
    });

    response.json({
      data: products.map((product) => ({
        ...product,
        price: formatPiasters(product.pricePiasters),
      })),
    });
  } catch (error) {
    next(error);
  }
});

productsRouter.get('/:id', async (request, response, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: request.params.id,
      },
      include: {
        brand: true,
        category: true,
      },
    });

    if (!product) {
      response.status(404).json({
        error: 'Product not found',
      });
      return;
    }

    response.json({
      data: {
        ...product,
        price: formatPiasters(product.pricePiasters),
      },
    });
  } catch (error) {
    next(error);
  }
});
