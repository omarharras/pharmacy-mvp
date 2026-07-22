import { Request, Response } from 'express';

import { prisma } from './prisma';

export function getBearerToken(authorizationHeader: string | undefined) {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authorizationHeader.slice('Bearer '.length);
}

export async function requireCustomer(request: Request, response: Response) {
  const token = getBearerToken(request.headers.authorization);

  if (!token) {
    response.status(401).json({
      error: 'Authentication required',
    });
    return null;
  }

  const customer = await prisma.customer.findUnique({
    where: {
      sessionToken: token,
    },
  });

  if (!customer) {
    response.status(401).json({
      error: 'Invalid session',
    });
    return null;
  }

  return customer;
}
