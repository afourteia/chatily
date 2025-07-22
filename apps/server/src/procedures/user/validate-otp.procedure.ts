import {
  middleware,
  type WrappedFunctionErrorWithObservable,
  type WrappedFunctionObservable,
} from '~/utils/middleware';
// import { verifyTOTP } from '~/utils/otp';
import { ServerError } from '~/utils/error';
// import { createCUID } from '~/utils/id';
// import { logLevelEnum } from '@chatally/enum';
import {
  // validateOtpInputSchema,
  type ValidateOtpInput,
  type ValidateOtpOutput,
} from '@chatally/api';
import type { PrismaInstance } from '~/utils/db';

async function validateOtp({
  input: _input,
  requesterId: _requesterId,
  prisma: _prisma,
}: {
  input: ValidateOtpInput;
  requesterId?: string | null;
  prisma: PrismaInstance;
}): Promise<
  | (ValidateOtpOutput & WrappedFunctionObservable)
  | WrappedFunctionErrorWithObservable
> {
  return {
    type: 'error',
    error: new ServerError({
      message: 'This endpoint is not available in the current version',
      code: 'INVARIANT_VIOLATION',
    }),
    delayResponse: 1000,
  };
  // const parsedInput = validateOtpInputSchema.parse(input);
  // const user = await prisma.user.findFirst({
  //   where: {
  //     employee: {
  //       phone: parsedInput.phone,
  //     },
  //   },
  //   include: {
  //     otp: true,
  //     userSecret: true,
  //   },
  // });

  // if (!user) {
  //   await prisma.eventLog.create({
  //     data: {
  //       id: createCUID(),
  //       message: `User with unregistered phone ${parsedInput.phone} attempted to validate OTP but failed`,
  //       levelTypeId: logLevelEnum.ids.ERROR,
  //       source: SoftwareConfigParser.getSoftwareName(),
  //       meta: {
  //         phone: parsedInput.phone,
  //       },
  //     },
  //   });
  //   const timeElapsed = new Date().getTime() - timeNow.getTime();
  //   if (timeElapsed < 500) {
  //     await new Promise((resolve) => setTimeout(resolve, 500 - timeElapsed));
  //   }
  //   throw new ServerError({
  //     message: 'Invalid phone number or OTP',
  //     code: 'UNAUTHORIZED',
  //   });
  // }

  // if (!user.userSecret) {
  //   await prisma.eventLog.create({
  //     data: {
  //       id: createCUID(),
  //       message: `User with phone ${parsedInput.phone} attempted to validate their OTP with missing user secret`,
  //       levelTypeId: logLevelEnum.ids.ERROR,
  //       source: SoftwareConfigParser.getSoftwareName(),
  //       meta: {
  //         phone: parsedInput.phone,
  //         userId: user.id,
  //       },
  //     },
  //   });
  //   const timeElapsed = new Date().getTime() - timeNow.getTime();
  //   if (timeElapsed < 1000) {
  //     await new Promise((resolve) => setTimeout(resolve, 1000 - timeElapsed));
  //   }
  //   throw new ServerError({
  //     message: 'Account is not in a state to be validated',
  //     code: 'UNAUTHORIZED',
  //   });
  // }

  // const otpRecord = user.otp;

  // if (
  //   !otpRecord ||
  //   !verifyTOTP(parsedInput.otp, user.userSecret.otpSecret) ||
  //   otpRecord.token !== parsedInput.otp ||
  //   //! TESTING: Remove this line
  //   parsedInput.otp.split('').every((digit) => digit === parsedInput.otp[0])
  // ) {
  //   await prisma.eventLog.create({
  //     data: {
  //       id: createCUID(),
  //       message: `OTP validation failed for phone ${parsedInput.phone}`,
  //       levelTypeId: logLevelEnum.ids.ERROR,
  //       source: SoftwareConfigParser.getSoftwareName(),
  //       meta: {
  //         phone: parsedInput.phone,
  //       },
  //     },
  //   });
  //   const timeElapsed = new Date().getTime() - timeNow.getTime();
  //   if (timeElapsed < 500) {
  //     await new Promise((resolve) => setTimeout(resolve, 500 - timeElapsed));
  //   }
  //   throw new ServerError({
  //     message: 'Invalid phone number or OTP',
  //     code: 'UNAUTHORIZED',
  //   });
  // }

  // return {
  //   type: 'response',
  //   status: 'SUCCESS',
  //   message: 'OTP validated successfully',
  //   data: undefined,
  // };
}

export default middleware(validateOtp);
