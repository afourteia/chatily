import {
  modelNameObj,
  type GetOperations,
  type PostOperations,
} from '@chatally/db';
import { Prisma } from '@chatally/db/generated/prisma/client';
import { type WrappedFunctionResponse } from '@chatally/api';
import { ServerError } from '~/utils/error';
import { middleware, type WrappedFunctionObservable } from '~/utils/middleware';
import type { PrismaInstance } from '~/utils/db';

async function serveTransaction({
  input,
  _requesterId,
  prisma,
}: {
  input: {
    args: unknown;
    ModelName: Prisma.ModelName;
    operationName: GetOperations | PostOperations;
  }[];
  _requesterId?: string | null;
  prisma: PrismaInstance;
}): Promise<WrappedFunctionResponse & WrappedFunctionObservable> {
  const MAX_RETRIES = 5;
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const results = await prisma.$transaction(
        input.map((request) => {
          const { ModelName, operationName, args } = request;
          // const modelNameCapitalized =
          //   modelName.charAt(0).toUpperCase() + modelName.slice(1);

          if (!(ModelName in Prisma.ModelName)) {
            throw new ServerError({
              message: `Model ${ModelName} not found`,
              code: 'NOT_FOUND',
            });
          }
          const modelName = modelNameObj[ModelName];
          const modelInstance = prisma[modelName];
          if (!(operationName in modelInstance)) {
            throw new ServerError({
              message: `Operation ${operationName} not found for model ${modelName}`,
              code: 'NOT_FOUND',
            });
          }

          // @ts-expect-error Prisma client type
          return modelInstance[operationName](args);
        }),
      );

      return {
        type: 'response',
        status: 'SUCCESS',
        message: 'Transaction completed successfully',
        data: results,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2034'
      ) {
        retries++;
        continue;
      }
      throw error;
    }
  }
  throw new ServerError({
    message: 'Transaction failed after maximum retries',
    code: 'INTERNAL_SERVER_ERROR',
  });
}

export default middleware(serveTransaction);
