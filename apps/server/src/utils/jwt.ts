import type { Algorithm as JWT_Algorithm } from 'jsonwebtoken';

export const JWTKeyParser = (() => {
  let privateKey: string;
  let publicKey: string;
  let algorithm: JWT_Algorithm;
  let expiration: string;
  const loadAlgorithm = (): void => {
    const jwtAlgorithm = process.env.JWT_ALGORITHM as JWT_Algorithm | undefined;
    if (!jwtAlgorithm) {
      throw new Error(
        `JWT_ALGORITHM is not defined in the env file ${process.env.NODE_ENV}`,
      );
    }
    algorithm = jwtAlgorithm;
  };
  const getAlgorithm = (): JWT_Algorithm => {
    if (!algorithm) {
      loadAlgorithm();
    }

    return algorithm;
  };
  const loadPrivateKey = (): void => {
    const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
    if (!jwtPrivateKey) {
      throw new Error(
        `JWT_PRIVATE_KEY is not defined in the env file ${process.env.NODE_ENV}`,
      );
    }
    privateKey = jwtPrivateKey;
  };
  const loadPublicKey = (): void => {
    const jwtPublicKey = process.env.JWT_PUBLIC_KEY;
    if (!jwtPublicKey) {
      throw new Error(
        `JWT_PUBLIC_KEY is not defined in the env file ${process.env.NODE_ENV}`,
      );
    }
    publicKey = jwtPublicKey;
  };
  const getPrivateKey = (): string => {
    if (!privateKey) {
      loadPrivateKey();
    }

    return privateKey;
  };
  const getPublicKey = (): string => {
    if (!publicKey) {
      loadPublicKey();
    }

    return publicKey;
  };
  const getExpiration = (): string => {
    if (!expiration) {
      if (!process.env.JWT_EXPIRATION) {
        throw new Error(
          `JWT_EXPIRATION is not defined in the env file ${process.env.NODE_ENV}`,
        );
      }
      expiration = process.env.JWT_EXPIRATION;
    }

    return expiration;
  };

  return {
    getPrivateKey,
    getPublicKey,
    getAlgorithm,
    getExpiration,
  };
})();

export const refreshTokenKeyParser = (() => {
  let privateKey: string;
  let publicKey: string;
  let algorithm: JWT_Algorithm;
  let expiration: string;

  const loadAlgorithm = (): void => {
    const jwtAlgorithm = process.env.REFRESH_TOKEN_ALGORITHM as
      | JWT_Algorithm
      | undefined;
    if (!jwtAlgorithm) {
      throw new Error(
        `REFRESH_TOKEN_ALGORITHM is not defined in the env file ${process.env.NODE_ENV}`,
      );
    }
    algorithm = jwtAlgorithm;
  };
  const getAlgorithm = (): JWT_Algorithm => {
    if (!algorithm) {
      loadAlgorithm();
    }

    return algorithm;
  };
  const loadPrivateKey = (): void => {
    const jwtPrivateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
    if (!jwtPrivateKey) {
      throw new Error(
        `REFRESH_TOKEN_PRIVATE_KEY is not defined in the env file ${process.env.NODE_ENV}`,
      );
    }
    privateKey = jwtPrivateKey;
  };
  const loadPublicKey = (): void => {
    const jwtPublicKey = process.env.REFRESH_TOKEN_PUBLIC_KEY;
    if (!jwtPublicKey) {
      throw new Error(
        `REFRESH_TOKEN_PUBLIC_KEY is not defined in the env file ${process.env.NODE_ENV}`,
      );
    }
    publicKey = jwtPublicKey;
  };
  const getPrivateKey = (): string => {
    if (!privateKey) {
      loadPrivateKey();
    }

    return privateKey;
  };
  const getPublicKey = (): string => {
    if (!publicKey) {
      loadPublicKey();
    }

    return publicKey;
  };
  const getExpiration = (): string => {
    if (!expiration) {
      if (!process.env.REFRESH_TOKEN_EXPIRATION) {
        throw new Error(
          `REFRESH_TOKEN_EXPIRATION key is not defined in the env file ${process.env.NODE_ENV}`,
        );
      }
      expiration = process.env.REFRESH_TOKEN_EXPIRATION;
    }

    return expiration;
  };

  return {
    getPrivateKey,
    getPublicKey,
    getAlgorithm,
    getExpiration,
  };
})();
