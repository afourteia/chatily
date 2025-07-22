import { z } from 'zod';
import { type WrappedFunctionResponse } from '../index';
import type { Results, Arguments } from '@project-name/db';

const args = {
  include: {
    beneficiaries: true,
  },
} satisfies Arguments<'BeneficiaryEntity', 'findFirst'>;

export const viewBeneficiaryEntityInputSchema = z
  .object({
    workId: z.string().nonempty('يجب توفير الرقم الوظيفي'),
    contractId: z.string().nonempty('يجب توفير رمز العقد'),
  })
  .strict();

export type ViewBeneficiaryEntityInput = z.input<
  typeof viewBeneficiaryEntityInputSchema
>;
export type ViewBeneficiaryEntityOutput = WrappedFunctionResponse<
  Results<'BeneficiaryEntity', typeof args, 'findFirst'>
>;
