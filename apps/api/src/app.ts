import cors from 'cors';
import express from 'express';

import { brandsRouter } from './routes/brands';
import { addressesRouter } from './routes/addresses';
import { branchesRouter } from './routes/branches';
import { categoriesRouter } from './routes/categories';
import { healthRouter } from './routes/health';
import { offersRouter } from './routes/offers';
import { ordersRouter } from './routes/orders';
import { productsRouter } from './routes/products';
import { uploadsRouter } from './routes/uploads';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images'));
app.use('/uploads', express.static('uploads'));

app.use('/health', healthRouter);
app.use('/addresses', addressesRouter);
app.use('/brands', brandsRouter);
app.use('/branches', branchesRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);
app.use('/offers', offersRouter);
app.use('/uploads', uploadsRouter);
app.use('/orders', ordersRouter);

app.use((_request, response) => {
  response.status(404).json({
    error: 'Not found',
  });
});

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);

    response.status(500).json({
      error: 'Internal server error',
    });
  },
);
