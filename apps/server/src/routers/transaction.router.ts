import { Router } from 'express';
import serveTransaction from '~/services/transaction.service';
import superjson from 'superjson';

const transactionRouter: Router = Router();

transactionRouter.post('/', async (req, res, next) => {
  try {
    const input = superjson.deserialize(req.body);
    await serveTransaction(req, res, input, {
      bypassAuth: false,
      bypassAuthz: true,
    });
  } catch (err) {
    next(err);
  }
});
export default transactionRouter;
