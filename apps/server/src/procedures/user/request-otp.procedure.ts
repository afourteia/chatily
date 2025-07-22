import {
  middleware,
  type WrappedFunctionErrorWithObservable,
  type WrappedFunctionObservable,
} from '~/utils/middleware';
// import { generateTOTP } from '~/utils/otp';
// import { createCUID } from '~/utils/id';
// import {
//   logLevelEnum,
//   transmissionStageEnum,
//   transmissionTypeEnum,
// } from '@chatally/enum';
import {
  // requestOtpInputSchema,
  type RequestOtpInput,
  type RequestOtpOutput,
} from '@chatally/api';
// import { SoftwareConfigParser } from '~/utils/environment';
import type { PrismaInstance } from '~/utils/db';
import { ServerError } from '~/utils/error';

async function requestOtp({
  input: _input,
  requesterId: _requesterId,
  prisma: _prisma,
}: {
  input: RequestOtpInput;
  requesterId?: string | null;
  prisma: PrismaInstance;
}): Promise<
  | (RequestOtpOutput & WrappedFunctionObservable)
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
  // const timeNow = new Date();
  // const parsedInput = requestOtpInputSchema.parse(input);
  // const returnObject = {
  //   type: 'response',
  //   status: 'SUCCESS',
  //   message:
  //     'OTP requested successfully, if the phone number is registered, you will receive an OTP shortly',
  //   data: {
  //     requestId: parsedInput.requestId,
  //   },
  // } as const;
  // const sms = await prisma.shortMessageService.findFirst({
  //   where: {
  //     recipientPhone: parsedInput.phone,
  //     messageTypeId: transmissionTypeEnum.ids.OTP,
  //     createdAt: { gte: new Date(new Date().getTime() - 10 * 60 * 1000) },
  //   },
  // });

  // if (sms) {
  //   await prisma.eventLog.create({
  //     data: {
  //       id: createCUID(),
  //       message: `Multiple OTP requests for registered phone number ${parsedInput.phone}`,
  //       levelTypeId: logLevelEnum.ids.WARN,
  //       source: SoftwareConfigParser.getSoftwareName(),
  //       meta: ({
  //         phone: parsedInput.phone,
  //       }),
  //     },
  //   });
  //   const timeElapsed = new Date().getTime() - timeNow.getTime();
  //   if (timeElapsed < 500) {
  //     await new Promise((resolve) => setTimeout(resolve, 500 - timeElapsed));
  //   }

  //   return returnObject;
  // }
  // const user = await prisma.user.findFirst({
  //   where: {
  //     employee: {
  //       phone: parsedInput.phone,
  //     },
  //   },
  //   include: {
  //     userSecret: true,
  //   },
  // });

  // if (!user) {
  //   await prisma.eventLog.create({
  //     data: {
  //       id: createCUID(),
  //       message: `OTP requested for unregistered phone number ${parsedInput.phone}`,
  //       levelTypeId: logLevelEnum.ids.WARN,
  //       source: SoftwareConfigParser.getSoftwareName(),
  //       meta: ({
  //         phone: parsedInput.phone,
  //         purpose: parsedInput.purpose,
  //       }),
  //     },
  //   });
  //   const timeElapsed = new Date().getTime() - timeNow.getTime();
  //   if (timeElapsed < 500) {
  //     await new Promise((resolve) => setTimeout(resolve, 500 - timeElapsed));
  //   }

  //   return returnObject;
  // }

  // if (!user.userSecret) {
  //   await prisma.eventLog.create({
  //     data: {
  //       id: createCUID(),
  //       message: `User with phone ${parsedInput.phone} attempted to request OTP for their account with missing user secret`,
  //       levelTypeId: logLevelEnum.ids.ERROR,
  //       source: SoftwareConfigParser.getSoftwareName(),
  //       meta: ({
  //         phone: parsedInput.phone,
  //         userId: user.id,
  //       }),
  //     },
  //   });
  //   const timeElapsed = new Date().getTime() - timeNow.getTime();
  //   if (timeElapsed < 500) {
  //     await new Promise((resolve) => setTimeout(resolve, 500 - timeElapsed));
  //   }

  //   return returnObject;
  // }

  // const otpToken = generateTOTP(user.userSecret.otpSecret);

  // await prisma.$transaction([
  //   prisma.oneTimePassword.upsert({
  //     where: { userId: user.id },
  //     update: { token: otpToken },
  //     create: {
  //       id: parsedInput.requestId,
  //       token: otpToken,
  //       user: { connect: { id: user.id } },
  //     },
  //   }),

  //   prisma.eventLog.create({
  //     data: {
  //       id: createCUID(),
  //       message: `OTP requested for registered phone number ${parsedInput.phone}`,
  //       levelTypeId: logLevelEnum.ids.INFO,
  //       source: SoftwareConfigParser.getSoftwareName(),
  //       meta: ({
  //         phone: parsedInput.phone,
  //         purpose: parsedInput.purpose,
  //       }),
  //     },
  //   }),

  //   prisma.shortMessageService.create({
  //     data: {
  //       id: createCUID(),
  //       message: `Your OTP is ${otpToken}. Please do not share this with anyone.`,
  //       recipientPhone: parsedInput.phone,
  //       transmissionStageId: transmissionStageEnum.ids.PENDING,
  //       messageTypeId: transmissionTypeEnum.ids.OTP,
  //     },
  //   }),
  // ]);

  // return returnObject;
}

export default middleware(requestOtp);
