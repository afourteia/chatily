import { z } from 'zod';
import { type WrappedFunctionResponse } from '../index';
import type { Results } from '@chatally/db';

export const viewBeneficiaryInputSchema = z
  .object({
    id: z.string().nonempty().optional(),
    name: z.string().nonempty().optional(),
    dalilId: z.string().nonempty().optional(),
    workId: z.string().nonempty().optional(),
    contractId: z.string().nonempty().optional(),
  })
  .strict();

export type ViewBeneficiaryInput = z.input<typeof viewBeneficiaryInputSchema>;
export type ViewBeneficiaryOutput = WrappedFunctionResponse<
  Results<'Beneficiary', {}, 'findFirst'>
>;
