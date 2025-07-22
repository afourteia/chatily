/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Router } from 'express';
import superjson from 'superjson';
import user from '~/services/user.service';

const userRouter: Router = Router();

userRouter.get('/', async (req, res, next) => {
  try {
    res.json(req.originalUrl);
  } catch (err) {
    next(err);
  }
});

userRouter.get('/aggregate', async (req, res, next) => {
  try {
    let input = {};
    if (typeof req.query.q === 'string') {
      input = superjson.parse(req.query.q);
    }
    await user.aggregate(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

userRouter.get('/findFirst', async (req, res, next) => {
  try {
    let input = {};
    if (typeof req.query.q === 'string') {
      input = superjson.parse(req.query.q);
    }
    await user.findFirst(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

userRouter.get('/findFirstOrThrow', async (req, res, next) => {
  try {
    let input = {};
    if (typeof req.query.q === 'string') {
      input = superjson.parse(req.query.q);
    }
    await user.findFirstOrThrow(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

userRouter.get('/findMany', async (req, res, next) => {
  try {
    let input = {};
    if (typeof req.query.q === 'string') {
      input = superjson.parse(req.query.q);
    }
    await user.findMany(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

// userRouter.get('/tableQuery', async (req, res, next) => {
//   try {
//     let input = {} as any;
//     if (typeof req.query.q === 'string') {
//       input = superjson.parse(req.query.q);
//     }
//     const [data, filteredCount, unFilteredCount] = await Promise.all([
//       user.findMany(req, res, input, { bypassAuth: false }),
//       user.count(req, { where: input?.where }, { bypassAuth: false }),
//       user.count(req, {}, { bypassAuth: false }),
//     ]);
//     const statistics: {
//       key: string;
//       value: string | number | boolean;
//     }[] = [];
//     res.json(
//       superjson.serialize({
//         data,
//         filteredCount,
//         unFilteredCount,
//         statistics,
//       }),
//     );
//   } catch (err) {
//     next(err);
//   }
// });

userRouter.get('/findUnique', async (req, res, next) => {
  try {
    let input = {} as any;
    if (typeof req.query.q === 'string') {
      input = superjson.parse(req.query.q);
    }
    await user.findUnique(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

userRouter.get('/findUniqueOrThrow', async (req, res, next) => {
  try {
    let input = {} as any;
    if (typeof req.query.q === 'string') {
      input = superjson.parse(req.query.q);
    }
    await user.findUniqueOrThrow(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

userRouter.get('/groupBy', async (req, res, next) => {
  try {
    let input = {} as any;
    if (typeof req.query.q === 'string') {
      input = superjson.parse(req.query.q);
    }
    await user.groupBy(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

userRouter.get('/count', async (req, res, next) => {
  try {
    let input = {};
    if (typeof req.query.q === 'string') {
      input = superjson.parse(req.query.q);
    }
    await user.count(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

userRouter.post('/createMany', async (req, res, next) => {
  try {
    const input = superjson.deserialize(req.body) as any;
    await user.createMany(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

userRouter.post('/create', async (req, res, next) => {
  try {
    const input = superjson.deserialize(req.body) as any;
    await user.createOne(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

userRouter.post('/deleteMany', async (req, res, next) => {
  try {
    const input = superjson.deserialize(req.body) as any;
    await user.deleteMany(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

userRouter.post('/delete', async (req, res, next) => {
  try {
    const input = superjson.deserialize(req.body) as any;
    await user.deleteOne(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

userRouter.post('/updateMany', async (req, res, next) => {
  try {
    const input = superjson.deserialize(req.body) as any;
    await user.updateMany(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

userRouter.post('/update', async (req, res, next) => {
  try {
    const input = superjson.deserialize(req.body) as any;
    await user.updateOne(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

userRouter.post('/upsert', async (req, res, next) => {
  try {
    const input = superjson.deserialize(req.body) as any;
    await user.upsertOne(req, res, input, { bypassAuth: false });
  } catch (err) {
    next(err);
  }
});

export default userRouter;
