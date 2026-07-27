import { Router } from 'express';

import { requireCustomer } from '../lib/auth';
import { formatPiasters } from '../lib/money';
import { prisma } from '../lib/prisma';

export const favoritesRouter = Router();

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

favoritesRouter.get('/', async (request, response, next) => {
  try {
    const customer = await requireCustomer(request, response);

    if (!customer) {
      return;
    }

    const favorites = await prisma.favoriteProduct.findMany({
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            subcategory: true,
            units: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        customerId: customer.id,
      },
    });

    response.json({
      data: favorites.map((favorite) => ({
        createdAt: favorite.createdAt,
        id: favorite.id,
        product: formatProduct(favorite.product),
        productId: favorite.productId,
      })),
    });
  } catch (error) {
    next(error);
  }
});

favoritesRouter.post('/:productId', async (request, response, next) => {
  try {
    const customer = await requireCustomer(request, response);

    if (!customer) {
      return;
    }

    const product = await prisma.product.findUnique({
      where: {
        id: request.params.productId,
      },
    });

    if (!product) {
      response.status(404).json({
        error: 'Product not found',
      });
      return;
    }

    const favorite = await prisma.favoriteProduct.upsert({
      create: {
        customerId: customer.id,
        productId: product.id,
      },
      update: {},
      where: {
        customerId_productId: {
          customerId: customer.id,
          productId: product.id,
        },
      },
    });

    response.status(201).json({
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
});

favoritesRouter.delete('/:productId', async (request, response, next) => {
  try {
    const customer = await requireCustomer(request, response);

    if (!customer) {
      return;
    }

    await prisma.favoriteProduct.deleteMany({
      where: {
        customerId: customer.id,
        productId: request.params.productId,
      },
    });

    response.json({
      data: {
        deleted: true,
      },
    });
  } catch (error) {
    next(error);
  }
});
