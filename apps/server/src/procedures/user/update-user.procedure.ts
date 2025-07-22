import {
  middleware,
  type WrappedFunctionErrorWithObservable,
  type WrappedFunctionObservable,
} from '~/utils/middleware';
import { ServerError } from '~/utils/error';
import { activeStatusEnum, logLevelEnum } from '@project-name/enum';
import {
  updateUserInputSchema,
  type UpdateUserInput,
  type UpdateUserOutput,
} from '@project-name/api';
import { getUpdaterId } from '~/utils/creator';
import type { PrismaInstance } from '~/utils/db';

async function updateUser({
  input,
  requesterId,
  prisma,
}: {
  input: UpdateUserInput;
  requesterId?: string | null;
  prisma: PrismaInstance;
}): Promise<
  | (UpdateUserOutput & WrappedFunctionObservable)
  | WrappedFunctionErrorWithObservable
> {
  const parsedInput = updateUserInputSchema.parse(input);
  const updater = getUpdaterId(requesterId);
  //TODO: Check if user rule is allowed to update user
  const user = await prisma.user.findUnique({
    where: {
      id: parsedInput.userId,
    },
    include: {
      otp: true,
      userSecret: true,
    },
  });

  if (!user) {
    return {
      type: 'error',
      error: new ServerError({
        message: 'User not found',
        code: 'NOT_FOUND',
      }),
      delayResponse: 1000,
      log: {
        message: `Unregistered user with id ${parsedInput.userId} attempted to update their account but failed`,
        levelTypeId: logLevelEnum.ids.ERROR,
        meta: {
          userId: parsedInput.userId,
        },
      },
    };
  }

  if (!user.userSecret) {
    return {
      type: 'error',
      error: new ServerError({
        message: 'User secret not found',
        code: 'INTERNAL_SERVER_ERROR',
      }),
      delayResponse: 1000,
      log: {
        message: `An update to UserId ${user.id} was attempted with missing user secret`,
        levelTypeId: logLevelEnum.ids.ERROR,
        meta: {
          phone: parsedInput.phone,
          userId: user.id,
        },
      },
    };
  }

  if (
    !user.isActive
    // TODO: check if user doesn't have escalated privileges
  ) {
    return {
      type: 'error',
      error: new ServerError({
        message: 'User account is not active',
        code: 'NOT_FOUND',
      }),
      delayResponse: 1000,
      log: {
        message: `An update to UserId ${user.id} was attempted but the user is not active`,
        levelTypeId: logLevelEnum.ids.ERROR,
        meta: {
          userId: user.id,
          expectedStatuses: activeStatusEnum.ids.PENDING,
        },
      },
    };
  }
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: parsedInput.name,
      username: parsedInput.username,
      email: parsedInput.email,
      phone: parsedInput.phone,
      isActive: parsedInput.isActive,
      ...updater,
    },
  });

  return {
    type: 'response',
    status: 'SUCCESS',
    message: 'Account activated successfully',
    data: {
      targetUserId: user.id,
      updatedFields: {
        name: parsedInput.name,
        username: parsedInput.username,
        email: parsedInput.email,
        phone: parsedInput.phone,
        isActive: parsedInput.isActive,
      },
    },
    log: {
      message: `user ${user.id} updated their account`,
      levelTypeId: logLevelEnum.ids.INFO,
      meta: {
        name: parsedInput.name,
        username: parsedInput.username,
        email: parsedInput.email,
        phone: parsedInput.phone,
        isActive: parsedInput.isActive,
      },
    },
  };
}

export default middleware(updateUser);
