import { z } from 'zod';
import { type WrappedFunctionResponse } from '../index';

export const updateUserInputSchema = z
  .object({
    userId: z.string().nonempty('رمز المستخدم مطلوب'),
    name: z
      .string()
      .nonempty('الاسم مطلوب')
      .max(60, 'الاسم يجب أن لا يتجاوز 60 حرفًا')
      .optional(),
    username: z
      .string()
      .min(3, 'اسم المستخدم يجب أن يكون على الأقل 3 أحرف')
      .max(20, 'اسم المستخدم يجب أن لا يتجاوز 20 حرفًا')
      .nullish(),
    email: z.string().email('البريد الإلكتروني غير صالح').nullish(),
    phone: z
      .string()
      .regex(/^09\d{8}$/, 'رقم الهاتف غير صالح')
      .nullish(),
    isActive: z.boolean().optional(),
  })
  .strict();

export type UpdateUserInput = z.input<typeof updateUserInputSchema>;
export type UpdateUserOutput = WrappedFunctionResponse<{
  targetUserId: string;
  updatedFields: Partial<UpdateUserInput>;
}>;
