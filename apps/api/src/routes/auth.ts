import crypto from 'node:crypto';
import { promisify } from 'node:util';

import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../lib/prisma';

const scrypt = promisify(crypto.scrypt);

const authInputSchema = z.object({
  password: z.string().min(6),
  phone: z.string().min(8),
});

const signupInputSchema = authInputSchema.extend({
  fullName: z.string().min(2),
});

export const authRouter = Router();

authRouter.post('/signup', async (request, response, next) => {
  try {
    const parsed = signupInputSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        details: parsed.error.flatten(),
        error: 'Invalid signup request',
      });
      return;
    }

    const existingCustomer = await prisma.customer.findUnique({
      where: {
        phone: parsed.data.phone,
      },
    });

    if (existingCustomer) {
      response.status(409).json({
        error: 'Phone number is already registered',
      });
      return;
    }

    const sessionToken = createSessionToken();
    const customer = await prisma.customer.create({
      data: {
        fullName: parsed.data.fullName,
        passwordHash: await hashPassword(parsed.data.password),
        phone: parsed.data.phone,
        sessionToken,
      },
    });

    response.status(201).json({
      data: {
        customer: serializeCustomer(customer),
        token: sessionToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/signin', async (request, response, next) => {
  try {
    const parsed = authInputSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        details: parsed.error.flatten(),
        error: 'Invalid signin request',
      });
      return;
    }

    const customer = await prisma.customer.findUnique({
      where: {
        phone: parsed.data.phone,
      },
    });

    if (!customer || !(await verifyPassword(parsed.data.password, customer.passwordHash))) {
      response.status(401).json({
        error: 'Invalid phone or password',
      });
      return;
    }

    const sessionToken = createSessionToken();
    const updatedCustomer = await prisma.customer.update({
      data: {
        sessionToken,
      },
      where: {
        id: customer.id,
      },
    });

    response.json({
      data: {
        customer: serializeCustomer(updatedCustomer),
        token: sessionToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', async (request, response, next) => {
  try {
    const token = getBearerToken(request.headers.authorization);

    if (!token) {
      response.status(401).json({
        error: 'Authentication required',
      });
      return;
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
      return;
    }

    response.json({
      data: serializeCustomer(customer),
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/signout', async (request, response, next) => {
  try {
    const token = getBearerToken(request.headers.authorization);

    if (token) {
      await prisma.customer.updateMany({
        data: {
          sessionToken: null,
        },
        where: {
          sessionToken: token,
        },
      });
    }

    response.json({
      data: {
        signedOut: true,
      },
    });
  } catch (error) {
    next(error);
  }
});

function createSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(':');

  if (!salt || !key) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const storedKey = Buffer.from(key, 'hex');

  return storedKey.length === derivedKey.length && crypto.timingSafeEqual(storedKey, derivedKey);
}

function getBearerToken(authorizationHeader: string | undefined) {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authorizationHeader.slice('Bearer '.length);
}

function serializeCustomer(customer: {
  createdAt: Date;
  fullName: string;
  id: string;
  phone: string;
  updatedAt: Date;
}) {
  return {
    createdAt: customer.createdAt,
    fullName: customer.fullName,
    id: customer.id,
    phone: customer.phone,
    updatedAt: customer.updatedAt,
  };
}
