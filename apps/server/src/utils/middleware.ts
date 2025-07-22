import type { Request, Response } from 'express';
import { getUserIdFromHeader } from '~/utils/auth';
import { Decimal } from 'decimal.js';
import superjson from 'superjson';
import type { Prisma } from '@chatally/db/generated/prisma/client';
import type { PrismaInstance } from '~/utils/db';
import prisma from '~/utils/db';
import { ServerError } from '~/utils/error';
import { createCUID } from '~/utils/id';
import type { WrappedFunctionResponse } from '@chatally/api';
superjson.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v),
  },
  'decimal.js',
);

type MiddlewareContext = {
  bypassAuthz?: boolean;
  bypassAuth?: boolean;
};

type LogDescription = Pick<
  Prisma.EventLogUncheckedCreateInput,
  'meta' | 'message'
> &
  Partial<Pick<Prisma.EventLogUncheckedCreateInput, 'levelTypeId'>>;

// type Prettify<T> = {
//   [K in keyof T]: T[K];
// } & {};

type NotificationDescription = Pick<
  Prisma.NotificationCreateManyInput,
  'message' | 'title' | 'payload' | 'userId'
>;

// 'topicId' | 'userId';

export interface WrappedFunctionError {
  type: 'error';
  error: ServerError;
  delayResponse?: number;
}

export interface WrappedFunctionObservable {
  log?: LogDescription;
  notification?: NotificationDescription[];
}

export interface WrappedFunctionResponseWithObservable
  extends WrappedFunctionResponse,
    WrappedFunctionObservable {}

export interface WrappedFunctionErrorWithObservable
  extends WrappedFunctionError,
    WrappedFunctionObservable {}

export function middleware(
  wrappedFunc: ({
    input,
    requesterId,
    prisma,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any;
    requesterId?: string | null;
    prisma: PrismaInstance;
  }) => Promise<
    WrappedFunctionResponseWithObservable | WrappedFunctionErrorWithObservable
  >,
) {
  return async function (
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any,
    context: MiddlewareContext = {
      bypassAuthz: false,
      bypassAuth: false,
    },
  ): Promise<void> {
    // console.log('req', _request);
    // console.log(
    //   `Middleware: Entering ${req.baseUrl} ${wrappedFunc.name} @ ${new Date().toISOString()}`,
    // );
    if (context.bypassAuth) {
      const result = await wrappedFunc({
        input,
        requesterId: null,
        prisma,
      });
      if (result.type === 'error') {
        await Promise.allSettled([
          log(result.log),
          notification(result.notification),
        ]);
        throw new ServerError(result.error);
      } else {
        const responseBody = superjson.serialize({
          status: result.status,
          message: result.message,
          data: result.data,
        });
        res.json(responseBody);

        await Promise.allSettled([
          log(result.log),
          notification(result.notification),
        ]);
        // TODO: handle error from log and notification

        return;
      }
    }
    const userId = await getUserIdFromHeader(req);
    // TODO: rate limiter
    // TODO: update last active
    if (context.bypassAuthz) {
      const result = await wrappedFunc({
        input,
        requesterId: userId,
        prisma,
      });
      // console.log('data', data);
      if (result.type === 'error') {
        await Promise.allSettled([
          log(result.log),
          notification(result.notification),
        ]);
        throw new ServerError(result.error);
      }
      const responseBody = superjson.serialize({
        status: result.status,
        message: result.message,
        data: result.data,
      });
      // console.log('responseBody', responseBody);
      res.json(responseBody);

      await Promise.allSettled([
        log(result.log),
        notification(result.notification),
      ]);
      // TODO: handle error from log and notification

      return;
    }
    // TODO wrap this in zenstack runtime
    const result = await wrappedFunc({
      input,
      requesterId: userId,
      prisma,
    });
    // console.log('data', data);
    if (result.type === 'error') {
      await Promise.allSettled([
        log(result.log),
        notification(result.notification),
      ]);
      throw new ServerError(result.error);
    }
    const responseBody = superjson.serialize({
      status: result.status,
      message: result.message,
      data: result.data,
    });
    // console.log('responseBody', responseBody);
    res.json(responseBody);
    await Promise.allSettled([
      log(result.log),
      notification(result.notification),
    ]);
    // TODO: handle error from log and notification

    return;
  };
}

async function log(log?: LogDescription) {
  // console.log('log', log);

  if (log) {
    await prisma.eventLog.create({
      data: {
        id: createCUID(),
        source: 'salary-server',
        ...log,
        levelTypeId: log.levelTypeId ?? 'INFO', //logLevelEnum.ids.INFO,
      },
    });
  }

  return null;
}

async function notification(notification?: NotificationDescription[]) {
  // console.log('notification', notification);

  if (notification && notification.length > 0) {
    await prisma.notification.createMany({
      data: notification.map((n) => ({
        id: createCUID(),
        // transmissionStageId: transmissionStageEnum.ids.PENDING,
        ...n,
        // messageTypeId: n.messageTypeId ?? transmissionTypeEnum.ids.TRANSACTION,
      })),
    });
  }

  return null;
}

// async function validate() {
//   console.log('validate');

//   return null;
// }

// async function errorHandler() {
//   console.log('errorHandler');

//   return null;
// }

// async function rateLimiter() {
//   console.log('rateLimiter');

//   return null;
// }
