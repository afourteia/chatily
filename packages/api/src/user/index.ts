import { z } from 'zod';
import { type WrappedFunctionResponse } from '../index';
export * from './create-user';
export * from './update-user';
export * from './reset-user-password';

export const loginInputSchema = z
  .object({
    identifier: z
      .string()
      .nonempty()
      .refine(
        (val) =>
          /^09\d{8}$/.test(val) || // Syrian phone number
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || // Email
          /^[a-zA-Z0-9_]{3,30}$/.test(val), // Username (3-30 chars, alphanumeric/underscore)
        {
          message:
            'المعرف يجب أن يكون رقم هاتف (09########)، بريد إلكتروني صحيح، أو اسم مستخدم من 3 إلى 30 رمزاً (أحرف أو أرقام أو _)',
        },
      ),
    password: z
      .string()
      .min(1, {
        message: 'يجب أن يحتوي الرمز السري على 1 رمز على الأقل',
      })
      .max(30, {
        message: 'يجب أن يحتوي الرمز السري على 30 رمز على الأكثر',
      }),
  })
  .strict()
  .transform(
    (
      data,
    ):
      | {
          identifierType: 'email';
          password: string;
          email: string;
          phone: undefined;
          username: undefined;
        }
      | {
          identifierType: 'phone';
          password: string;
          email: undefined;
          phone: string;
          username: undefined;
        }
      | {
          identifierType: 'username';
          password: string;
          email: undefined;
          phone: undefined;
          username: string;
        } => {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier)) {
        // Email
        return {
          identifierType: 'email',
          password: data.password,
          email: data.identifier.toLowerCase(),
          phone: undefined,
          username: undefined,
        };
      } else if (/^09\d{8}$/.test(data.identifier)) {
        // Phone
        return {
          identifierType: 'phone',
          password: data.password,
          phone: data.identifier,
          email: undefined,
          username: undefined,
        };
      } else {
        // Username
        return {
          identifierType: 'username',
          password: data.password,
          username: data.identifier,
          email: undefined,
          phone: undefined,
        };
      }
    },
  );

export type LoginInput = z.input<typeof loginInputSchema>;
export type LoginOutput = WrappedFunctionResponse<{
  accessToken: string;
  refreshToken: string;
  info: {
    userId: string;
    name: string;
    phone: string | null;
    email: string | null;
    username: string | null;
    // firstName: string;
    // lastName: string;
    // userRole: string[];
  };
}>;

export const updateUserPasswordInputSchema = z
  .object({
    identifier: z
      .string()
      .nonempty()
      .nullable()
      .refine(
        (val) =>
          val === null ||
          /^09\d{8}$/.test(val) || // Syrian phone number
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || // Email
          /^[a-zA-Z0-9_]{3,30}$/.test(val), // Username (3-30 chars, alphanumeric/underscore)
        {
          message:
            'المعرف يجب أن يكون رقم هاتف (09########)، بريد إلكتروني صحيح، أو اسم مستخدم من 3 إلى 30 رمزاً (أحرف أو أرقام أو _)',
        },
      ),
    userId: z.string().nonempty().nullable(),
    oldPassword: z.string().max(30),
    otp: z
      .string()
      .regex(/^\d+$/, 'يجب أن يكون رمز التحقق أرقاماً فقط')
      .length(6, 'يجب أن يتكون رمز التحقق من 6 أرقام'),
    newPassword: z
      .string()
      .min(8, {
        message:
          'يجب أن تحتوي كلمة المرور الجديدة على 8 رموز على الأقل' as const,
      })
      .max(30, {
        message: 'يجب أن تحتوي كلمة المرور الجديدة على 30 رمز على الأكثر',
      })
      .regex(
        /^(?=(?:.*[A-Za-z\u0600-\u06FF]){2,})(?=.*\d)[A-Za-z\u0600-\u06FF\d]{8,30}$/,
        'يجب أن تحتوي كلمة المرور الجديدة على حرفين (عربي أو إنجليزي) على الأقل ورقم واحد على الأقل، وأن تكون بين 8 و30 رمزاً',
      ),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.oldPassword === '' || data.otp === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'يجب تزويد إما كلمة المرور القديمة أو رمز التحقق',
        path: ['oldPassword', 'otp'], // This will highlight both fields
      });
    }
    if (!data.userId && !data.identifier) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'يجب التزيد بمَـعرّف المستخدم',
        path: ['userId', 'identifier'], // This will highlight both fields
      });
    }
  })
  .transform(
    (
      data,
    ):
      | undefined
      | ((
          | {
              identifierType: 'userId';
              email: undefined;
              phone: undefined;
              username: undefined;
              userId: string;
            }
          | {
              identifierType: 'email';
              email: string;
              phone: undefined;
              username: undefined;
              userId: undefined;
            }
          | {
              identifierType: 'phone';
              email: undefined;
              phone: string;
              username: undefined;
              userId: undefined;
            }
          | {
              identifierType: 'username';
              email: undefined;
              phone: undefined;
              username: string;
              userId: undefined;
            }
        ) &
          (
            | {
                AuthType: 'oldPassword';
                oldPassword: string;
                otp: undefined;
                newPassword: string;
              }
            | {
                AuthType: 'otp';
                oldPassword: undefined;
                otp: string;
                newPassword: string;
              }
          )) => {
      if (data.userId) {
        if (data.otp !== '') {
          return {
            identifierType: 'userId',
            AuthType: 'otp',
            newPassword: data.newPassword,
            otp: data.otp,
            userId: data.userId,
            oldPassword: undefined,
            email: undefined,
            phone: undefined,
            username: undefined,
          };
        }
        if (data.oldPassword !== '') {
          return {
            identifierType: 'userId',
            AuthType: 'oldPassword',
            newPassword: data.newPassword,
            oldPassword: data.oldPassword,
            userId: data.userId,
            otp: undefined,
            email: undefined,
            phone: undefined,
            username: undefined,
          };
        }
      }
      if (data.identifier) {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier)) {
          // Email
          if (data.otp !== '')
            return {
              identifierType: 'email',
              AuthType: 'otp',
              otp: data.otp,
              newPassword: data.newPassword,
              email: data.identifier.toLowerCase(),
              phone: undefined,
              username: undefined,
              oldPassword: undefined,
              userId: undefined,
            };
          if (data.oldPassword !== '')
            return {
              identifierType: 'email',
              AuthType: 'oldPassword',
              oldPassword: data.oldPassword,
              newPassword: data.newPassword,
              email: data.identifier.toLowerCase(),
              phone: undefined,
              username: undefined,
              otp: undefined,
              userId: undefined,
            };
        } else if (/^09\d{8}$/.test(data.identifier)) {
          // Phone
          if (data.otp !== '')
            return {
              identifierType: 'phone',
              AuthType: 'otp',
              otp: data.otp,
              newPassword: data.newPassword,
              phone: data.identifier,
              email: undefined,
              username: undefined,
              oldPassword: undefined,
              userId: undefined,
            };
          if (data.oldPassword !== '') {
            return {
              identifierType: 'phone',
              AuthType: 'oldPassword',
              oldPassword: data.oldPassword,
              newPassword: data.newPassword,
              phone: data.identifier,
              email: undefined,
              username: undefined,
              otp: undefined,
              userId: undefined,
            };
          }
        } else {
          // Username
          if (data.otp !== '')
            return {
              identifierType: 'username',
              AuthType: 'otp',
              otp: data.otp,
              newPassword: data.newPassword,
              username: data.identifier,
              email: undefined,
              phone: undefined,
              oldPassword: undefined,
              userId: undefined,
            };
          if (data.oldPassword !== '') {
            return {
              identifierType: 'username',
              AuthType: 'oldPassword',
              oldPassword: data.oldPassword,
              newPassword: data.newPassword,
              username: data.identifier,
              email: undefined,
              phone: undefined,
              otp: undefined,
              userId: undefined,
            };
          }
        }
      }

      return undefined;
    },
  );

export type UpdateUserPasswordInput = z.input<
  typeof updateUserPasswordInputSchema
>;
export type UpdateUserPasswordOutput = WrappedFunctionResponse<{
  targetUserId: string;
}>;

export const refreshAccessTokenInputSchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export type RefreshAccessTokenInput = z.input<
  typeof refreshAccessTokenInputSchema
>;
export type RefreshAccessTokenOutput = WrappedFunctionResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const requestOtpInputSchema = z
  .object({
    requestId: z.string(), //.cuid2(),
    phone: z
      .string()
      .regex(/^09\d{8}$/, 'Phone number must follow the format 09########'),
    purpose: z.enum(['RESET_PASSWORD', 'ACTIVE_ACCOUNT', 'CRITICAL_ACTION']),
  })
  .strict();

export type RequestOtpInput = z.input<typeof requestOtpInputSchema>;
export type RequestOtpOutput = WrappedFunctionResponse<{
  requestId: string;
}>;

export const validateOtpInputSchema = z
  .object({
    phone: z
      .string()
      .regex(/^09\d{8}$/, 'Phone number must follow the format 09########'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  })
  .strict();

export type ValidateOtpInput = z.input<typeof validateOtpInputSchema>;
export type ValidateOtpOutput = WrappedFunctionResponse<undefined>;
