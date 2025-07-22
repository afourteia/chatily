import { Router } from 'express';
import resetDbData from '~/services/seed.service';
import superjson from 'superjson';

const seedRouter: Router = Router();

seedRouter.post('/', async (req, res, next) => {
  try {
    const input = superjson.deserialize(req.body);
    await resetDbData(req, res, input, {
      bypassAuth: true,
    });
  } catch (err) {
    next(err);
  }
});
export default seedRouter;
