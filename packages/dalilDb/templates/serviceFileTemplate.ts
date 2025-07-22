/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import type { Prisma } from '@prisma/main/prisma/generated/client';
// import { enhancedPrisma, prisma } from '@configs/db';
import prisma from '~/configs/db';
import { middleware } from '~/utils/middleware';

async function findMany<T extends Prisma.UserFindManyArgs>(
  // params: Prisma.Exact<T, Prisma.UserFindManyArgs>,
  params: T,
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data fetched successfully' as const,
    data: await prisma.user.findMany(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data fetched successfully' as const,
  //   data: await enhancedPrisma(_userId).user.findMany(params),
  // };
}

async function findUnique<T extends Prisma.UserFindUniqueArgs>(
  // params: Prisma.Exact<T, Prisma.UserFindUniqueArgs>,
  params: T,
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data fetched successfully' as const,
    data: await prisma.user.findUnique(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data fetched successfully' as const,
  //   data: await enhancedPrisma(_userId).user.findUnique(params),
  // };
}

async function findUniqueOrThrow<T extends Prisma.UserFindUniqueOrThrowArgs>(
  // params: Prisma.Exact<T, Prisma.UserFindUniqueOrThrowArgs>,
  params: T,
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data fetched successfully' as const,
    data: await prisma.user.findUniqueOrThrow(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data fetched successfully' as const,
  //   data: await enhancedPrisma(_userId).user.findUniqueOrThrow(params),
  // };
}

async function findFirst<T extends Prisma.UserFindFirstArgs>(
  // params: Prisma.Exact<T, Prisma.UserFindFirstArgs>,
  params: T,
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data fetched successfully' as const,
    data: await prisma.user.findFirst(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data fetched successfully' as const,
  //   data: await enhancedPrisma(_userId).user.findFirst(params),
  // };
}

async function findFirstOrThrow<T extends Prisma.UserFindFirstOrThrowArgs>(
  // params: Prisma.Exact<T, Prisma.UserFindFirstOrThrowArgs>,
  params: T,
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data fetched successfully' as const,
    data: await prisma.user.findFirstOrThrow(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data fetched successfully' as const,
  //   data: await enhancedPrisma(_userId).user.findFirstOrThrow(params),
  // };
}

async function createMany<T extends Prisma.UserCreateManyArgs>(
  // params: Prisma.Exact<T, Prisma.UserCreateManyArgs>,
  params: T,
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data mutated successfully' as const,
    data: await prisma.user.createMany(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data mutated successfully' as const,
  //   data: await enhancedPrisma(_userId).user.createMany(params),
  // };
}

async function createOne<T extends Prisma.UserCreateArgs>(
  // params: Prisma.Exact<T, Prisma.UserCreateArgs>,
  params: T,
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data mutated successfully' as const,
    data: await prisma.user.create(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data mutated successfully' as const,
  //   data: await enhancedPrisma(_userId).user.create(params),
  // };
}

async function updateMany<T extends Prisma.UserUpdateManyArgs>(
  // params: Prisma.Exact<T, Prisma.UserUpdateManyArgs>,
  params: T,
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data mutated successfully' as const,
    data: await prisma.user.updateMany(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data mutated successfully' as const,
  //   data: await enhancedPrisma(_userId).user.updateMany(params),
  // };
}

async function updateOne<T extends Prisma.UserUpdateArgs>(
  // params: Prisma.Exact<T, Prisma.UserUpdateArgs>,
  params: T,
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data mutated successfully' as const,
    data: await prisma.user.update(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data mutated successfully' as const,
  //   data: await enhancedPrisma(_userId).user.update(params),
  // };
}

async function upsertOne<T extends Prisma.UserUpsertArgs>(
  // params: Prisma.Exact<T, Prisma.UserUpsertArgs>,
  params: T,
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data mutated successfully' as const,
    data: await prisma.user.upsert(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data mutated successfully' as const,
  //   data: await enhancedPrisma(_userId).user.upsert(params),
  // };
}

async function deleteMany<T extends Prisma.UserDeleteManyArgs>(
  // params: Prisma.Exact<T, Prisma.UserDeleteManyArgs>,
  params: T,
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data mutated successfully' as const,
    data: await prisma.user.deleteMany(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data mutated successfully' as const,
  //   data: await enhancedPrisma(_userId).user.deleteMany(params),
  // };
}

async function deleteOne<T extends Prisma.UserDeleteArgs>(
  // params: Prisma.Exact<T, Prisma.UserDeleteArgs>,
  params: T,
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data mutated successfully' as const,
    data: await prisma.user.delete(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data mutated successfully' as const,
  //   data: await enhancedPrisma(_userId).user.delete(params),
  // };
}

async function count<T extends Prisma.UserCountArgs>(
  // params: Prisma.Exact<T, Prisma.UserCountArgs>,
  params: T,
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data fetched successfully' as const,
    data: await prisma.user.count(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data fetched successfully' as const,
  //   data: {
  //     count: await enhancedPrisma(_userId).user.count(params),
  //   },
  // };
}

async function aggregate<T extends Prisma.UserAggregateArgs>(
  // params: Prisma.Exact<T, Prisma.UserAggregateArgs>,
  params: T,
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data fetched successfully' as const,
    data: await prisma.user.aggregate(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data fetched successfully' as const,
  //   data: await enhancedPrisma(_userId).user.aggregate(params),
  // };
}

async function groupBy<T extends Prisma.UserGroupByArgs>(
  // params: Prisma.Exact<T, Prisma.UserGroupByArgs>,
  params: T & {
    orderBy:
      | Prisma.UserOrderByWithAggregationInput
      | Prisma.UserOrderByWithAggregationInput[];
  },
  _userId: string | null = null,
  _useUnguarded: boolean = false,
) {
  // if (_useUnguarded) {
  return {
    status: 'SUCCESS' as const,
    message: 'Data fetched successfully' as const,
    data: await prisma.user.groupBy(params),
  };
  // }

  // return {
  //   status: 'SUCCESS' as const,
  //   message: 'Data fetched successfully' as const,
  //   data: await enhancedPrisma(_userId).user.groupBy(params),
  // };
}

const user = {
  findMany: middleware(findMany),
  findUnique: middleware(findUnique),
  findUniqueOrThrow: middleware(findUniqueOrThrow),
  findFirst: middleware(findFirst),
  findFirstOrThrow: middleware(findFirstOrThrow),
  createMany: middleware(createMany),
  createOne: middleware(createOne),
  updateMany: middleware(updateMany),
  updateOne: middleware(updateOne),
  upsertOne: middleware(upsertOne),
  deleteMany: middleware(deleteMany),
  deleteOne: middleware(deleteOne),
  count: middleware(count),
  aggregate: middleware(aggregate),
  groupBy: middleware(groupBy),
};

export default user;
