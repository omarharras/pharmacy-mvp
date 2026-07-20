import { Router } from 'express';

import { prisma } from '../lib/prisma';

export const branchesRouter = Router();

branchesRouter.get('/', async (_request, response, next) => {
  try {
    const branches = await prisma.branch.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    response.json({ data: branches });
  } catch (error) {
    next(error);
  }
});

branchesRouter.get('/:id', async (request, response, next) => {
  try {
    const branch = await prisma.branch.findUnique({
      where: {
        id: request.params.id,
      },
    });

    if (!branch) {
      response.status(404).json({
        error: 'Branch not found',
      });
      return;
    }

    response.json({ data: branch });
  } catch (error) {
    next(error);
  }
});
