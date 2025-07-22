// import prisma from '~/configs/db';
// import { z } from 'zod';
// import { middleware } from '~/utils/middleware';
// import { createCUID } from '~/utils/id';
// import { generateSecret } from '~/utils/otp';
// import { ServerError } from '~/utils/error';
// import SuperJSON from 'superjson';
// import {
//   ActiveStatusEnum,
//   TransmissionTypeEnum,
//   TransmissionStageEnum,
//   LogLevelEnum,
// } from '~/utils/enums';
// import { SoftwareConfigParser } from '~/utils/environment';

// export const createUserInputSchema = z
//   .object({
//     id: z.string(), //.cuid2(),
//     username: z.string().max(20).optional(),
//     name: z.string().max(60),
//     activationCode: z.string().max(6).optional(),
//     phone: z
//       .string()
//       .regex(/^09\d{8}$/, 'Phone number must follow the format 09########'),
//   })
//   .strict();
// export type CreateUserInput = z.infer<typeof createUserInputSchema>;
// export type CreateUserOutput = Promise<{
//   status: 'SUCCESS' | 'FAILURE';
//   message: string;
//   data?: object;
// }>;

// async function createUser(
//   input: CreateUserInput,
//   requestUserId: string | null = null,
// ): CreateUserOutput {
//   const parsedInput = createUserInputSchema.parse(input);
//   if (!requestUserId) {
//     throw new ServerError({
//       message: 'Request user not authenticated',
//       code: 'UNAUTHORIZED',
//     });
//   }

//   await prisma.$transaction([
//     prisma.user.create({
//       data: {
//         id: parsedInput.id,
//         // username: parsedInput.username,
//         // phone: parsedInput.phone,
//         name: parsedInput.name,
//         isActive: false,
//         activeStatusId: ActiveStatusEnum.ids.PENDING,
//         userSecret: {
//           create: {
//             id: createCUID(),
//             otpSecret: generateSecret(),
//           },
//         },
//         // activationCode: {
//         //   create: {
//         //     id: createCUID(),
//         //     code: parsedInput.activationCode,
//         //   },
//         // },
//         creatorId: requestUserId,
//         updaterId: requestUserId,
//         // rowStatusSetAt: new Date(),
//         // statusSetById: requestUserId,
//       },
//     }),
//     prisma.shortMessageService.create({
//       data: {
//         id: createCUID(),
//         message: `Your account has been created. Activate your account with your activation code, otp and phone number.`,
//         messageTypeId: TransmissionTypeEnum.ids.TRANSACTION,
//         recipientPhone: parsedInput.phone,
//         transmissionStageId: TransmissionStageEnum.ids.PENDING,
//       },
//     }),
//     prisma.notification.createMany({
//       data: [
//         {
//           id: createCUID(),
//           title: 'Account Created',
//           message: `Account with phone ${parsedInput.phone} has been created. an SMS will be sent to the user.`,
//           messageTypeId: TransmissionTypeEnum.ids.TRANSACTION,
//           recipientUserId: requestUserId,
//           transmissionStageId: TransmissionStageEnum.ids.PENDING,
//         },
//         {
//           id: createCUID(),
//           title: 'Account Created',
//           message: `Account created for ${parsedInput.phone}`,
//           messageTypeId: TransmissionTypeEnum.ids.TRANSACTION,
//           recipientUserId: parsedInput.id,
//           transmissionStageId: TransmissionStageEnum.ids.PENDING,
//         },
//       ],
//     }),
//     prisma.eventLog.create({
//       data: {
//         id: createCUID(),
//         message: `User ${parsedInput.id} is created by ${requestUserId}`,
//         levelTypeId: LogLevelEnum.ids.INFO,
//         source: SoftwareConfigParser.getSoftwareName(),
//         meta: ({
//           phone: parsedInput.phone,
//           userId: parsedInput.id,
//           requestUserId,
//         }),
//       },
//     }),
//   ]);

//   return {
//     status: 'SUCCESS',
//     message: 'User created successfully',
//     data: {
//       newUserId: parsedInput.id,
//       phone: parsedInput.phone,
//     },
//   };
// }

// export default middleware(createUser);
