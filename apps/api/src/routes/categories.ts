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
    const subcategories = await prisma.subcategory.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });
    const subcategoriesByParentId = new Map<string | null, typeof subcategories>();

    for (const subcategory of subcategories) {
      const siblings = subcategoriesByParentId.get(subcategory.parentId) ?? [];
      siblings.push(subcategory);
      subcategoriesByParentId.set(subcategory.parentId, siblings);
    }

    function getChildren(parentId: string): (typeof subcategories[number] & {
      children: ReturnType<typeof getChildren>;
    })[] {
      return (subcategoriesByParentId.get(parentId) ?? []).map((subcategory) => ({
        ...subcategory,
        children: getChildren(subcategory.id),
      }));
    }

    response.json({
      data: categories.map((category) => ({
        ...category,
        subcategories: (subcategoriesByParentId.get(null) ?? [])
          .filter((subcategory) => subcategory.categoryId === category.id)
          .map((subcategory) => ({
            ...subcategory,
            children: getChildren(subcategory.id),
          })),
      })),
    });
  } catch (error) {
    next(error);
  }
});
