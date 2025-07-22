import {
  type GetOperations,
  type PostOperations,
  modelNameObj,
} from '@chatally/db';
import { Prisma } from '@chatally/db/generated/prisma/client';
import { ServerError } from '~/utils/error';
import { middleware, type WrappedFunctionObservable } from '~/utils/middleware';
import { type WrappedFunctionResponse } from '@chatally/api';
import type { PrismaInstance } from '~/utils/db';

async function serveCRUD({
  input: { args, ModelName, operationName },
  _requesterId,
  prisma,
}: {
  input: {
    args: unknown;
    ModelName: Prisma.ModelName;
    operationName: GetOperations | PostOperations;
  };
  _requesterId?: string | null;
  prisma: PrismaInstance;
}): Promise<WrappedFunctionResponse & WrappedFunctionObservable> {
  const modelName = modelNameObj[ModelName];
  const modelInstance = prisma[modelName];
  if (!modelInstance) {
    throw new ServerError({
      message: `Model ${modelName} not found in Prisma client`,
      level: 'ERROR',
      code: 'INTERNAL_SERVER_ERROR',
      log: {
        message: `Model ${modelName} not found in Prisma client`,
        meta: {
          modelName,
          operationName,
        },
      },
    });
  }

  if (!(operationName in modelInstance)) {
    throw new ServerError({
      message: `Operation ${operationName} not found on model ${modelName}`,
      level: 'ERROR',
      code: 'INTERNAL_SERVER_ERROR',
      log: {
        message: `Operation ${operationName} not found on model ${modelName}`,
        meta: {
          modelName,
          operationName,
        },
      },
    });
  }

  return {
    type: 'response',
    status: 'SUCCESS',
    message: 'Data fetched successfully',
    // @ts-expect-error Prisma client type
    data: await modelInstance[operationName](args),
  };
}

export default middleware(serveCRUD);
