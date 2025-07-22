import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@chatally/db/generated/prisma/client';
import _stripAnsi from 'strip-ansi';
import chalk from 'chalk';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import superjson from 'superjson';

// import { LogLevelEnum } from './enums';
import jwt from 'jsonwebtoken';

type ServerErrorCodes =
  | 'INVARIANT_VIOLATION'
  | 'INVALID_DATE_RANGE'
  | 'INVALID_PERCENTAGE'
  | 'VALIDATION_ERROR'
  | 'INVALID_SUBMISSION'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'S3_SERVICE_ERROR'
  | 'INVALID_DOCUMENT_TYPE'
  | 'SMS_SERVICE_ERROR'
  | 'JOB_SERVICE_ERROR'
  | 'UNKNOWN_ERROR'
  | 'INTERNAL_SERVER_ERROR'
  | 'NOT_IMPLEMENTED';

const httpCodes: Record<ServerErrorCodes, StatusCodes> = {
  INVARIANT_VIOLATION: StatusCodes.BAD_REQUEST,
  INVALID_DATE_RANGE: StatusCodes.BAD_REQUEST,
  INVALID_PERCENTAGE: StatusCodes.BAD_REQUEST,
  VALIDATION_ERROR: StatusCodes.BAD_REQUEST,
  INVALID_SUBMISSION: StatusCodes.BAD_REQUEST,
  UNAUTHORIZED: StatusCodes.UNAUTHORIZED,
  FORBIDDEN: StatusCodes.FORBIDDEN,
  NOT_FOUND: StatusCodes.NOT_FOUND,
  S3_SERVICE_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
  INVALID_DOCUMENT_TYPE: StatusCodes.BAD_REQUEST,
  SMS_SERVICE_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
  JOB_SERVICE_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
  UNKNOWN_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
  INTERNAL_SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
  NOT_IMPLEMENTED: StatusCodes.NOT_IMPLEMENTED,
};
export class ServerError extends Error {
  code: ServerErrorCodes;
  type: string;
  // redirects?: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE' | 'FATAL';
  log?: {
    message: string;
    meta: Record<string, unknown>;
  };

  constructor(e: {
    message: string;
    code: ServerErrorCodes;
    log?: {
      message: string;
      meta: Record<string, unknown>;
    };
    level?: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE' | 'FATAL';
  }) {
    super(e.message);
    this.code = e.code;
    this.type = 'Application_ERROR';
    this.level = e.level ?? 'ERROR';
    this.log = e.log;
  }
}

export async function expressErrorHandler(
  err: Error | ServerError,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  // console.error(err);

  console.log(chalk.bgYellow('error keys:'), Object.keys(err));
  console.log('message:', err.message);

  try {
    // await prisma.eventLog.create({
    //   data: {
    //     id: createCUID(),
    //     message: err.message,
    //     source: 'clinicgate',
    //     levelTypeId: LogLevelEnum.keys.ERROR,
    //     metaJSON: JSON.stringify(
    //       {
    //         error: {
    //           ...err,
    //           stack: err.stack,
    //           name: err.name,
    //           message: err.message,
    //         },
    //         request: {
    //           url: req.url,
    //           method: req.method,
    //           body: req.body,
    //           query: req.query,
    //         },
    //       },
    //       null,
    //       2,
    //     ),
    //   },
    // });
  } catch (err) {
    console.log(err);
  }

  if (err instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json(
      superjson.serialize({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Refresh token has expired',
        },
        request: {
          url: req.url,
          method: req.method,
          body: req.body,
          query: req.query,
        },
      }),
    );
  }
  if (err instanceof jwt.NotBeforeError) {
    return res.status(StatusCodes.UNAUTHORIZED).json(
      superjson.serialize({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Refresh token is not yet valid',
        },
        request: {
          url: req.url,
          method: req.method,
          body: req.body,
          query: req.query,
        },
      }),
    );
  }
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json(
      superjson.serialize({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid refresh token',
        },
        request: {
          url: req.url,
          method: req.method,
          body: req.body,
          query: req.query,
        },
      }),
    );
  }

  if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientValidationError ||
    err instanceof Prisma.PrismaClientRustPanicError ||
    err instanceof Prisma.PrismaClientInitializationError
  ) {
    // @ts-expect-error Description: This error is expected because the 'code' property may not be available in some cases.
    const code = err.code ?? 'unknownError';
    // @ts-expect-error Description: This error is expected because the 'meta' property may not be available in some cases.
    const meta = err.meta ?? 'notAvailable';
    const cleanMessage = _stripAnsi(err.message)
      .replace(/\n/g, ' ')
      .replace(/\s\s+/g, ' ')
      .trim();
    const argumentMessageMatch = cleanMessage.match(/Argument.*$/);
    const argumentMessage = argumentMessageMatch
      ? argumentMessageMatch[0]
      : cleanMessage;
    // const message = err.message ?? 'notAvailable';
    console.log('error:', {
      name: err.name,
      code,
      meta,
      message: argumentMessage,
    });

    return res.status(StatusCodes.BAD_REQUEST).json(
      superjson.serialize({
        error: { name: err.name, code, meta, message: argumentMessage },
        request: {
          url: req.url,
          method: req.method,
          body: req.body,
          query: req.query,
        },
      }),
    );
  }

  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      superjson.serialize({
        error: {
          name: err.name,
          code: 'validationError',
          meta: err.issues,
          message: err.errors[0] ? err.errors[0].message : 'Invalid input',
        },
        request: {
          url: req.url,
          method: req.method,
          body: req.body,
          query: req.query,
        },
      }),
    );
  }

  if (err instanceof ServerError) {
    return res.status(httpCodes[err.code]).json(
      superjson.serialize({
        error: {
          name: err.name,
          code: err.code,
          type: err.type,
          meta: err.cause,
          message: err.message,
        },
        request: {
          url: req.url,
          method: req.method,
          body: req.body,
          query: req.query,
        },
      }),
    );
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
    superjson.serialize({
      error: {
        name: err.name,
        code: 'unknownError',
      },
      request: {
        url: req.url,
        method: req.method,
        body: req.body,
        query: req.query,
      },
    }),
  );
}
