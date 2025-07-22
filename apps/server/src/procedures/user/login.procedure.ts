import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { JWT_Payload, RefreshToken_Payload } from '~/utils/auth';
import { ServerError } from '~/utils/error';
import { createCUID } from '~/utils/id';
import { JWTKeyParser, refreshTokenKeyParser } from '~/utils/jwt';
import {
  middleware,
  type WrappedFunctionErrorWithObservable,
  type WrappedFunctionObservable,
} from '~/utils/middleware';
import { logLevelEnum } from '@chatally/enum';
import type { PrismaInstance } from '~/utils/db';
import {
  loginInputSchema,
  type LoginInput,
  type LoginOutput,
} from '@chatally/api';

async function login({
  input,
  requesterId: _requesterId,
  prisma,
}: {
  input: LoginInput;
  requesterId?: string | null;
  prisma: PrismaInstance;
}): Promise<
  (LoginOutput & WrappedFunctionObservable) | WrappedFunctionErrorWithObservable
> {
  const parsedInput = loginInputSchema.parse(input);
  // // Pad parsedInput.identifier with leading zeros if it's a number with less than 4 digits
  // let parsedInput.identifier = parsedInput.parsedInput.identifier;
  // console.log('parsedInput.identifier', parsedInput.identifier);
  // if (/^\d{1,4}$/.test(parsedInput.identifier)) {
  //   parsedInput.identifier = parsedInput.identifier.padStart(3, '0');
  // }
  // console.log('parsedInput.identifier', parsedInput.identifier);
  const user = await prisma.user.findUnique({
    where: {
      username: parsedInput.username,
      email: parsedInput.email,
      phone: parsedInput.phone,
    },
    include: {
      userSecret: true,
    },
    // orderBy: { id: 'asc' },
  });

  if (!user) {
    // const timeElapsed = new Date().getTime() - timeNow.getTime();
    // if (timeElapsed < 1000) {
    //   await new Promise((resolve) => setTimeout(resolve, 1000 - timeElapsed));
    // }

    return {
      type: 'error',
      error: new ServerError({
        message: 'Invalid phone or password ',
        code: 'NOT_FOUND',
      }),
      delayResponse: 1000,
      log: {
        message: `User with parsedInput.identifier ${input.identifier} not found`,
        levelTypeId: logLevelEnum.ids.ERROR,
        meta: {
          identifier: input.identifier,
          identifierType: parsedInput.identifierType,
        },
      },
    };
  }

  if (!user.userSecret) {
    return {
      type: 'error',
      error: new ServerError({
        message: 'Invalid phone or password ',
        code: 'NOT_FOUND',
      }),
      delayResponse: 1000,
      log: {
        message: `User with parsedInput.identifier ${user.id} attempted to log into their account with missing user secret`,
        levelTypeId: logLevelEnum.ids.ERROR,
        meta: {
          identifier:
            parsedInput.email ?? parsedInput.username ?? parsedInput.phone,
          identifierType: parsedInput.identifierType,
          userId: user.id,
        },
      },
    };
  }

  if (user.userSecret.passwordHash === null) {
    return {
      type: 'error',
      error: new ServerError({
        message: 'Invalid phone or password ',
        code: 'NOT_FOUND',
      }),
      delayResponse: 1000,
      log: {
        message: `User with parsedInput.identifier ${user.id} attempted to log into their account with missing password hash`,
        levelTypeId: logLevelEnum.ids.ERROR,
        meta: {
          identifier:
            parsedInput.email ?? parsedInput.username ?? parsedInput.phone,
          identifierType: parsedInput.identifierType,
          userId: user.id,
        },
      },
    };
  }

  const passwordMatch = await bcrypt.compare(
    parsedInput.password,
    user.userSecret.passwordHash,
  );

  // console.log('passwordMatch', passwordMatch);
  if (!passwordMatch) {
    return {
      type: 'error',
      error: new ServerError({
        message: 'Invalid phone or password ',
        code: 'NOT_FOUND',
      }),
      delayResponse: 1000,
      log: {
        message: `User with parsedInput.identifier ${user.id} attempted to log into their account with invalid password`,
        levelTypeId: logLevelEnum.ids.ERROR,
        meta: {
          identifier:
            parsedInput.email ?? parsedInput.username ?? parsedInput.phone,
          identifierType: parsedInput.identifierType,
          userId: user.id,
        },
      },
    };
  }

  if (!user.isActive) {
    return {
      type: 'error',
      error: new ServerError({
        message: 'حسابك غير مفعل الرجاء التواصل مع الدعم الفني',
        code: 'NOT_FOUND',
      }),
      delayResponse: 1000,
      log: {
        message: `User with parsedInput.identifier ${user.id} attempted to log into their account but failed because their account active status is ${user.isActive}`,
        levelTypeId: logLevelEnum.ids.ERROR,
        meta: {
          identifier:
            parsedInput.email ?? parsedInput.username ?? parsedInput.phone,
          identifierType: parsedInput.identifierType,
          userId: user.id,
          isAccountActive: user.isActive,
        },
      },
    };
  }
  const accessToken = jwt.sign(
    { userId: user.id, iss: 'dalil-shafi' } satisfies JWT_Payload,
    JWTKeyParser.getPrivateKey(),
    {
      algorithm: JWTKeyParser.getAlgorithm(),
      expiresIn: JWTKeyParser.getExpiration() as unknown as number,
    },
  );
  // const refreshToken = crypto.randomBytes(64).toString('hex');
  const refreshTokenId = createCUID();
  const refreshToken = jwt.sign(
    { iss: 'Dalil-Shafi', refreshTokenId } satisfies RefreshToken_Payload,
    refreshTokenKeyParser.getPrivateKey(),
    {
      algorithm: refreshTokenKeyParser.getAlgorithm(),
      expiresIn: refreshTokenKeyParser.getExpiration() as unknown as number,
    },
  );
  await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        id: refreshTokenId,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    }),
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastActiveAt: new Date(),
      },
    }),
  ]);

  return {
    type: 'response',
    status: 'SUCCESS',
    message: 'Login successful',
    data: {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
      info: {
        userId: user.id,
        name: user.name,
        phone: user.phone,
        username: user.username,
        email: user.email,
      },
    },
    log: {
      message: `Successful login for user ${user.id} with ${parsedInput.identifierType}: ${input.identifier}`,
      levelTypeId: logLevelEnum.ids.INFO,
      meta: {
        identifier: input.identifier,
        identifierType: parsedInput.identifierType,
        userId: user.id,
      },
    },
  };
}

export default middleware(login);
