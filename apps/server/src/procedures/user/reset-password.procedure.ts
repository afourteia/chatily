import {
  middleware,
  type WrappedFunctionErrorWithObservable,
  type WrappedFunctionObservable,
} from '~/utils/middleware';
import { ServerError } from '~/utils/error';
import bcrypt from 'bcrypt';
import { logLevelEnum } from '@chatally/enum';
import {
  resetPasswordInputSchema,
  type ResetPasswordInput,
  type ResetPasswordOutput,
} from '@chatally/api';
// import { getUpdaterId } from '~/utils/creator';
import type { PrismaInstance } from '~/utils/db';

function generateRandomPassword(
  length: number = 10,
  specialChars: string = '!@%^&*()_+-=?',
): string {
  const numbers = '0123456789';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const allChars = numbers + lower + upper + specialChars;

  let password = '';
  for (let i = 0; i < length - 1; i++) {
    const idx = Math.floor(Math.random() * allChars.length);
    password += allChars[idx];
  }

  // At one special character at a random position
  const specialCharIdx = Math.floor(Math.random() * length);
  password =
    password.slice(0, specialCharIdx) +
    specialChars[Math.floor(Math.random() * specialChars.length)] +
    password.slice(specialCharIdx);

  return password;
}

async function updateUser({
  input,
  requesterId,
  prisma,
}: {
  input: ResetPasswordInput;
  requesterId?: string | null;
  prisma: PrismaInstance;
}): Promise<
  | (ResetPasswordOutput & WrappedFunctionObservable)
  | WrappedFunctionErrorWithObservable
> {
  const parsedInput = resetPasswordInputSchema.parse(input);
  // const updater = getUpdaterId(requesterId);
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
        message: `Unregistered user with id ${parsedInput.userId} attempted to reset their password but failed`,
        levelTypeId: logLevelEnum.ids.ERROR,
        meta: {
          userId: parsedInput.userId,
          requesterId: requesterId,
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
        message: `Attempt to reset password for UserId ${user.id} failed due to missing user secret`,
        levelTypeId: logLevelEnum.ids.ERROR,
        meta: {
          requesterId: requesterId,
          userId: user.id,
        },
      },
    };
  }

  const generatedPassword = generateRandomPassword();
  const passwordHash = await bcrypt.hash(generatedPassword, 15);
  await prisma.userSecret.update({
    where: {
      userId: user.id,
    },
    data: {
      passwordHash,
      // ...updater, // TODO: Add Updater
    },
  });

  return {
    type: 'response',
    status: 'SUCCESS',
    message: 'تم تجديد كلمة المرور بنجاح',
    data: {
      targetUserId: user.id,
      newPassword: generatedPassword,
    },
    log: {
      message: `User ${user.id} password reset successfully`,
      levelTypeId: logLevelEnum.ids.INFO,
      meta: {
        requesterId: requesterId,
        userId: user.id,
      },
    },
    notification: [
      {
        title: 'تجديد كلمة المرور',
        message: 'تم تجديد كلمة المرور بنجاح',
        userId: user.id,
      },
    ],
  };
}

export default middleware(updateUser);
