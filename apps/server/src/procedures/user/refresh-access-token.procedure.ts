import { middleware, type WrappedFunctionObservable } from '~/utils/middleware';
import { ServerError } from '~/utils/error';
import { createCUID } from '~/utils/id';
import jwt from 'jsonwebtoken';
import { JWTKeyParser, refreshTokenKeyParser } from '~/utils/jwt';
import { logLevelEnum } from '@project-name/enum';
import {
  refreshAccessTokenInputSchema,
  type RefreshAccessTokenInput,
  type RefreshAccessTokenOutput,
} from '@project-name/api';
import type { PrismaInstance } from '~/utils/db';

async function refreshAccessToken({
  input,
  requesterId: _requesterId,
  prisma,
}: {
  input: RefreshAccessTokenInput;
  requesterId?: string | null;
  prisma: PrismaInstance;
}): Promise<RefreshAccessTokenOutput & WrappedFunctionObservable> {
  // console.log('input is', input);
  const parsedInput = refreshAccessTokenInputSchema.parse(input);
  const decodedRefreshToken = jwt.verify(
    parsedInput.refreshToken.replace('Bearer ', ''),
    refreshTokenKeyParser.getPublicKey(),
    { algorithms: [refreshTokenKeyParser.getAlgorithm()] },
  ) as {
    iss: string;
    refreshTokenId: string;
  };
  // console.log('Decoded Refresh Token:', decodedRefreshToken);
  const refreshIdDB = await prisma.refreshToken.findUnique({
    where: {
      id: decodedRefreshToken.refreshTokenId,
      revokedAt: null,
    },
  });
  if (!refreshIdDB) {
    throw new ServerError({
      message: 'Refresh token not found',
      code: 'UNAUTHORIZED',
    });
  }

  const newRefreshTokenId = createCUID();
  const newRefreshToken = jwt.sign(
    { iss: 'Dalil-Shafi', refreshTokenId: newRefreshTokenId },
    refreshTokenKeyParser.getPrivateKey(),
    {
      algorithm: refreshTokenKeyParser.getAlgorithm(),
      expiresIn: refreshTokenKeyParser.getExpiration() as unknown as number,
    },
  );
  const newAccessToken = jwt.sign(
    { userId: refreshIdDB.userId, iss: 'dalil-shafi' },
    JWTKeyParser.getPrivateKey(),
    {
      algorithm: JWTKeyParser.getAlgorithm(),
      expiresIn: JWTKeyParser.getExpiration() as unknown as number,
    },
  );

  await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        id: newRefreshTokenId,
        user: { connect: { id: refreshIdDB.userId } },
      },
    }),
    prisma.refreshToken.update({
      where: {
        id: decodedRefreshToken.refreshTokenId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: {
        id: refreshIdDB.userId,
      },
      data: {
        lastActiveAt: new Date(),
      },
    }),
  ]);

  return {
    type: 'response',
    status: 'SUCCESS',
    message: 'Refresh token generated successfully',
    data: {
      refreshToken: `Bearer ${newRefreshToken}`,
      accessToken: `Bearer ${newAccessToken}`,
    },
    log: {
      message: `User ${refreshIdDB.userId} refreshed their access token`,
      levelTypeId: logLevelEnum.ids.INFO,
      meta: {
        refreshTokenId: newRefreshTokenId,
        userId: refreshIdDB.userId,
      },
    },
  };
}

export default middleware(refreshAccessToken);
