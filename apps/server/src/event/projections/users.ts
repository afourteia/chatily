import { Prisma, PrismaClient } from '@salary/db/generated';
import { UserEventData } from '~/event/event-data/user';
import { Projections } from './index';

import { getCreatorObject, getUpdaterObject } from '~/utils/creator';
import { generateSecret } from '~/utils/otp';
export const userProjections: Projections<'user'> = {
  create,
  updateActiveStatus,
  updateDeviceTokens,
  updatePassword,
  updatePhoneVerifiedAt,
};

function create(
  data: UserEventData['create'],
  _version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): Promise<unknown>[] {
  return [
    prisma.user.create({
      data: {
        id: streamId,
        name: data.name,
        isActive: data.isActive,
        userSecret: {
          create: {
            otpSecret: generateSecret(),
            ...getCreatorObject(requestorId),
          },
        },
        ...getCreatorObject(requestorId),
      },
    }),
  ];
}

function updateActiveStatus(
  data: UserEventData['updateActiveStatus'],
  _version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): Promise<unknown>[] {
  return [
    prisma.user.update({
      where: { id: streamId },
      data: {
        isActive: data.isActive,
        ...getUpdaterObject(requestorId),
      },
    }),
  ];
}

function updateDeviceTokens(
  data: UserEventData['updateDeviceTokens'],
  _version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): Promise<unknown>[] {
  if (data.changeType === 'remove') {
    return [
      prisma.deviceToken.delete({
        where: { id: data.deviceToken },
      }),
    ];
  }

  return [
    prisma.deviceToken.create({
      data: {
        id: data.deviceToken,
        deviceType: data.deviceType,
        userId: streamId,
        creatorId: requestorId,
      },
    }),
  ];
}

function updatePassword(
  data: UserEventData['updatePassword'],
  _version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): Promise<unknown>[] {
  return [
    prisma.userSecret.update({
      where: { id: streamId },
      data: {
        passwordHash: data.passwordHash,
        ...getUpdaterObject(requestorId),
      },
    }),
  ];
}

function updatePhoneVerifiedAt(
  data: UserEventData['updatePhoneVerifiedAt'],
  _version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): Promise<unknown>[] {
  return [
    prisma.user.update({
      where: { id: streamId },
      data: {
        phoneVerifiedAt: data.phoneVerifiedAt,
        ...getUpdaterObject(requestorId),
      },
    }),
  ];
}
