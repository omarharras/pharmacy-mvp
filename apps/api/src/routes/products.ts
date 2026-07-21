import { Router } from 'express';

import { formatPiasters } from '../lib/money';
import { prisma } from '../lib/prisma';

export const productsRouter = Router();

function getUnitLabel(packageSize: string) {
  const value = packageSize.toLowerCase();

  if (value.includes('ml') || value.includes('spray') || value.includes('liquid')) {
    return 'Bottle';
  }

  if (
    value.includes('box') ||
    value.includes('cream') ||
    /\d+\s*g\b/.test(value) ||
    value.includes('diaper') ||
    value.includes('pad')
  ) {
    return 'Box';
  }

  return 'Piece';
}

function formatProduct<T extends {
  id: string;
  packageSize: string;
  pricePiasters: number;
  units?: {
    id: string;
    isDefault: boolean;
    label: string;
    pricePiasters: number;
    sortOrder: number;
  }[];
}>(product: T) {
  const fallbackUnit = {
    id: product.id,
    isDefault: true,
    label: getUnitLabel(product.packageSize),
    pricePiasters: product.pricePiasters,
    sortOrder: 1,
  };
  const units = (product.units?.length ? product.units : [fallbackUnit])
    .slice()
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((unit) => ({
      ...unit,
      price: formatPiasters(unit.pricePiasters),
    }));
  const defaultUnit = units.find((unit) => unit.isDefault) ?? units[0];

  return {
    ...product,
    pricePiasters: defaultUnit.pricePiasters,
    unitLabel: defaultUnit.label,
    units,
    price: formatPiasters(defaultUnit.pricePiasters),
  };
}

productsRouter.get('/', async (request, response, next) => {
  try {
    const query = typeof request.query.query === 'string' ? request.query.query : undefined;
    const categoryId =
      typeof request.query.categoryId === 'string' ? request.query.categoryId : undefined;
    const subcategoryId =
      typeof request.query.subcategoryId === 'string' ? request.query.subcategoryId : undefined;
    const brandId = typeof request.query.brandId === 'string' ? request.query.brandId : undefined;

    const products = await prisma.product.findMany({
      where: {
        brandId,
        categoryId,
        subcategoryId,
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
        subcategory: true,
        units: true,
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
      data: products.map((product) => formatProduct(product)),
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
        subcategory: true,
        units: true,
      },
    });

    if (!product) {
      response.status(404).json({
        error: 'Product not found',
      });
      return;
    }

    response.json({
      data: formatProduct(product),
    });
  } catch (error) {
    next(error);
  }
});
