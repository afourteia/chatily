import {
  middleware,
  type WrappedFunctionErrorWithObservable,
  type WrappedFunctionObservable,
} from '~/utils/middleware';
import { ServerError } from '~/utils/error';
import bcrypt from 'bcrypt';
import { createCUID } from '~/utils/id';
import { verifyTOTP } from '~/utils/otp';
import { logLevelEnum } from '@chatally/enum';
import {
  updateUserPasswordInputSchema,
  type UpdateUserPasswordInput,
  type UpdateUserPasswordOutput,
} from '@chatally/api';
import { SoftwareConfigParser } from '~/utils/environment';
import { getUpdaterId } from '~/utils/creator';
import type { PrismaInstance } from '~/utils/db';

async function updateUserPassword({
  input,
  requesterId: _requesterId,
  prisma,
}: {
  input: UpdateUserPasswordInput;
  requesterId?: string | null;
  prisma: PrismaInstance;
}): Promise<
  | (UpdateUserPasswordOutput & WrappedFunctionObservable)
  | WrappedFunctionErrorWithObservable
> {
  const parsedInput = updateUserPasswordInputSchema.parse(input);
  if (!parsedInput) {
    return {
      type: 'error',
      error: new ServerError({
        message: 'Invalid input data',
        code: 'INVARIANT_VIOLATION',
      }),
      delayResponse: 1000,
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      id: parsedInput.userId,
      username: parsedInput.username,
      email: parsedInput.email,
      phone: parsedInput.phone,
    },
    include: {
      otp: true,
      userSecret: true,
    },
  });

  if (!user) {
    await prisma.eventLog.create({
      data: {
        id: createCUID(),
        message: `Unregistered user ${parsedInput.userId} attempted to change their password but failed`,
        levelTypeId: logLevelEnum.ids.ERROR,
        source: SoftwareConfigParser.getSoftwareName(),
        meta: {
          // phone: parsedInput.phone,
          identifier:
            _requesterId ??
            parsedInput.userId ??
            parsedInput.username ??
            parsedInput.email ??
            parsedInput.phone,
          identifierType: parsedInput.identifierType,
        },
      },
    });

    return {
      type: 'error',
      error: new ServerError({
        message: 'Invalid phone, OTP or old password',
        code: 'NOT_FOUND',
      }),
      delayResponse: 1000,
    };
  }

  if (!user.userSecret) {
    await prisma.eventLog.create({
      data: {
        id: createCUID(),
        message: `User ${user.id} attempted to change their password but failed due to missing user secret`,
        levelTypeId: logLevelEnum.ids.ERROR,
        source: SoftwareConfigParser.getSoftwareName(),
        meta: {
          // phone: parsedInput.phone,
          userId: user.id,
          identifier:
            _requesterId ??
            parsedInput.userId ??
            parsedInput.username ??
            parsedInput.email ??
            parsedInput.phone,
        },
      },
    });

    return {
      type: 'error',
      error: new ServerError({
        message: 'Invalid phone, OTP or old password',
        code: 'NOT_FOUND',
      }),
      delayResponse: 1000,
    };
  }

  if (!user.isActive || user.userSecret.passwordHash === null) {
    await prisma.eventLog.create({
      data: {
        id: createCUID(),
        message: `User ${user.id} that is not Active or without a password attempted to change their password but failed`,
        levelTypeId: logLevelEnum.ids.ERROR,
        source: SoftwareConfigParser.getSoftwareName(),
        meta: {
          // phone: parsedInput.phone,
          userId: user.id,
          identifier:
            _requesterId ??
            parsedInput.userId ??
            parsedInput.username ??
            parsedInput.email ??
            parsedInput.phone,
        },
      },
    });

    return {
      type: 'error',
      error: new ServerError({
        message: 'Invalid phone, OTP or old password',
        code: 'NOT_FOUND',
      }),
      delayResponse: 1000,
    };
  }

  if (parsedInput.AuthType === 'oldPassword') {
    const updater = getUpdaterId(_requesterId);
    const passwordMatch = await bcrypt.compare(
      parsedInput.oldPassword,
      user.userSecret.passwordHash,
    );
    if (!passwordMatch) {
      await prisma.eventLog.create({
        data: {
          id: createCUID(),
          message: `User ${user.id} attempted to change their password with an incorrect old password`,
          levelTypeId: logLevelEnum.ids.ERROR,
          source: SoftwareConfigParser.getSoftwareName(),
          meta: {
            userId: user.id,
            updaterId: updater,
            identifier:
              _requesterId ??
              parsedInput.userId ??
              parsedInput.username ??
              parsedInput.email ??
              parsedInput.phone,
          },
        },
      });

      return {
        type: 'error',
        error: new ServerError({
          message: 'Invalid phone, OTP or old password',
          code: 'NOT_FOUND',
        }),
        delayResponse: 1000,
      };
    }
  } else if (parsedInput.AuthType === 'otp') {
    const otpProvided = parsedInput.otp;
    const otpRecord = user.otp;
    if (
      !otpRecord ||
      !verifyTOTP(parsedInput.otp, user.userSecret.otpSecret) ||
      otpRecord.token !== parsedInput.otp ||
      //! TESTING: Remove this line
      otpProvided.split('').every((digit) => digit === otpProvided[0])
    ) {
      await prisma.eventLog.create({
        data: {
          id: createCUID(),
          message: `User ${user.id} attempted to change their password with an incorrect OTP`,
          levelTypeId: logLevelEnum.ids.ERROR,
          source: SoftwareConfigParser.getSoftwareName(),
          meta: {
            // phone: parsedInput.phone,
            identifier:
              _requesterId ??
              parsedInput.userId ??
              parsedInput.username ??
              parsedInput.email ??
              parsedInput.phone,
            userId: user.id,
            providedOtp: parsedInput.otp,
            expectedOtp: otpRecord ? otpRecord.token : 'N/A',
          },
        },
      });

      return {
        type: 'error',
        error: new ServerError({
          message: 'Invalid phone, OTP or old password',
          code: 'NOT_FOUND',
        }),
        delayResponse: 1000,
      };
    }
  } else {
    return {
      type: 'error',
      error: new ServerError({
        message: 'Invalid phone, OTP or old password',
        code: 'NOT_FOUND',
      }),
      delayResponse: 1000,
      log: {
        message: `User ${user.id} attempted to change their password without providing an OTP or old password`,
        levelTypeId: logLevelEnum.ids.ERROR,
        meta: {
          // phone: parsedInput.phone,
          userId: user.id,
        },
      },
    };
  }

  const newPasswordHash = await bcrypt.hash(parsedInput.newPassword, 10);
  await prisma.userSecret.update({
    where: {
      userId: user.id,
    },
    data: {
      passwordHash: newPasswordHash,
      // updatedBy: { connect: { id: user.id } },
    },
  });

  await prisma.eventLog.create({
    data: {
      id: createCUID(),
      message: `User ${user.id} changed their password successfully`,
      levelTypeId: logLevelEnum.ids.INFO,
      source: SoftwareConfigParser.getSoftwareName(),
      meta: {
        // phone: parsedInput.phone,
        userId: user.id,
        identifier:
          _requesterId ??
          parsedInput.userId ??
          parsedInput.username ??
          parsedInput.email ??
          parsedInput.phone,
      },
    },
  });

  return {
    type: 'response',
    status: 'SUCCESS',
    message: 'Password changed successfully',
    data: {
      targetUserId: user.id,
    },
    log: {
      message: `User ${user.id} changed their password successfully`,
      levelTypeId: logLevelEnum.ids.INFO,
      meta: {
        requesterId: _requesterId,
        userId: user.id,
      },
    },
    notification: [
      {
        title: 'تغيير كلمة المرور',
        userId: user.id,
        payload: 'تم تغيير كلمة المرور بنجاح',
        message: 'تم تغيير كلمة المرور بنجاح',
      },
    ],
  };
}

export default middleware(updateUserPassword);
