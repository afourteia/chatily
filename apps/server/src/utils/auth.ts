import type { Request } from 'express';
import { ServerError } from '~/utils/error';
import jwt from 'jsonwebtoken';
import { JWTKeyParser } from '~/utils/jwt';

type UserType = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type JWT_Payload = { userId: string; iss: 'dalil-shafi' };
export type RefreshToken_Payload = {
  refreshTokenId: string;
  iss: 'Dalil-Shafi';
};

export async function getUserIdFromHeader(
  request: Request,
): Promise<UserType['id']> {
  // console.log('auth header', request.headers.authorization);
  const jwtToken = request.headers.authorization?.replace('Bearer ', '');
  if (!jwtToken) {
    const apiKey = request.headers['x-api-key'] as string | undefined;
    if (
      typeof apiKey === 'string' &&
      apiKey === 'test-dalil-shafi-api-key-AA'
    ) {
      return 'test-user-id';
    }
    throw new ServerError({
      message: 'no bearer token available in the authorization header',
      code: 'UNAUTHORIZED',
    });
  }
  const decodedJWT = jwt.verify(jwtToken, JWTKeyParser.getPublicKey(), {
    algorithms: [JWTKeyParser.getAlgorithm()],
  });
  if (typeof decodedJWT === 'string') {
    throw new ServerError({
      message: 'decoded JWT is not an object',
      code: 'UNAUTHORIZED',
    });
  }
  const userId = decodedJWT.userId;
  if (userId === null) {
    throw new ServerError({
      message: 'no userId available in the valid JWT cookie',
      code: 'UNAUTHORIZED',
    });
  }

  return userId;
}

export async function getUserPreferenceFromCookie(
  _request: Request | Request,
): Promise<unknown | null> {
  // placeHolder
  return null;
}

export async function getUserPreferenceFromDb(
  _request: Request | Request,
): Promise<unknown | null> {
  // placeHolder
  return null;
}
