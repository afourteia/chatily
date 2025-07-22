import { z } from 'zod';
import { type WrappedFunctionResponse } from '../index';

export const resetPasswordInputSchema = z
  .object({
    userId: z.string().nonempty('رمز المستخدم مطلوب'),
  })
  .strict();

export type ResetPasswordInput = z.input<typeof resetPasswordInputSchema>;
export type ResetPasswordOutput = WrappedFunctionResponse<{
  targetUserId: string;
  newPassword: string;
}>;
