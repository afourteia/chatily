import { z } from 'zod';
import { type WrappedFunctionResponse } from '../index';

export const createBeneficiaryInputSchema = z
  .object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    dalilId: z.string().nonempty(),
    relationship: z.string().nonempty(),
    dateOfBirth: z.date().optional(),
    isActive: z.boolean(),
    isHidden: z.boolean(),
    workId: z.string().nonempty(),
    contractId: z.string().nonempty(),
    dalilDbId: z.bigint().nonnegative(),
  })
  .strict();

export type CreateBeneficiaryInput = z.input<
  typeof createBeneficiaryInputSchema
>;
export type CreateBeneficiaryOutput = WrappedFunctionResponse<{
  beneficiaryId: string;
}>;
