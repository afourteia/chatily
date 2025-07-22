import { Router } from 'express';
import superjson from 'superjson';
import serveCRUD from '~/services/crud.service';

const crudRouter: Router = Router();

crudRouter.use('/:resource/:operation', async (req, res, next) => {
  try {
    // Add a fake delay for demonstration or testing purposes
    if (req.method === 'GET') {
      let input = {};
      if (typeof req.query.q === 'string') {
        input = superjson.parse(req.query.q);
      }
      await serveCRUD(
        req,
        res,
        {
          args: input,
          ModelName: req.params.resource,
          operationName: req.params.operation,
        },
        {
          bypassAuth: false,
          bypassAuthz: false,
        },
      );
    } else if (req.method === 'POST') {
      const input = superjson.deserialize(req.body);
      await serveCRUD(
        req,
        res,
        {
          args: input,
          ModelName: req.params.resource,
          operationName: req.params.operation,
        },
        {
          bypassAuth: false,
          bypassAuthz: false,
        },
      );
    }
  } catch (err) {
    console.error('Error in CRUD operation:');
    next(err);
  }
});

export default crudRouter;
