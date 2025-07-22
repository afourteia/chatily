import { z } from 'zod';
import { type WrappedFunctionResponse } from '../index';

export const createUserInputSchema = z
  .object({
    identifier: z.string().regex(/^(09\d{8}|\d{1,3})$/, {
      message:
        'يجب أن يكون المعرف رقم هاتف بالشكل 09######## أو رقم مكون من 1 إلى 3 أرقام',
    }),
    password: z
      .string()
      .min(6, {
        message: 'يجب أن يحتوي الرمز السري على 6 رموز على الأقل',
      })
      .max(30, {
        message: 'يجب أن يحتوي الرمز السري على 30 رمز على الأكثر',
      }),
  })
  .strict()
  .transform((data) => ({
    ...data,
    identifier: /^\d{1,3}$/.test(data.identifier)
      ? data.identifier.padStart(3, '0')
      : data.identifier,
  }));

export type CreateUserInput = z.input<typeof createUserInputSchema>;
export type CreateUserOutput = WrappedFunctionResponse<{
  beneficiaryId: string;
  status: string;
}>;
