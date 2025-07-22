import { z } from 'zod';
import { type WrappedFunctionResponse } from '../index';

export const updateBeneficiaryInputSchema = z
  .object({
    id: z.string().nonempty().optional(),
    name: z.string().nonempty().nonempty(),
    dalilId: z.string().nonempty().optional(),
    relationship: z.string().nonempty().optional(),
    dateOfBirth: z.date().nullish(),
    isActive: z.boolean().optional(),
    isHidden: z.boolean().optional(),
    workId: z.string().nonempty().optional(),
    contractId: z.string().nonempty().optional(),
    dalilDbId: z.bigint().nonnegative().optional(),
  })
  .strict();

export type UpdateBeneficiaryInput = z.input<
  typeof updateBeneficiaryInputSchema
>;
export type UpdateBeneficiaryOutput = WrappedFunctionResponse<{
  beneficiaryId: string;
  isActive?: boolean;
}>;
