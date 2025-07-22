import {
  middleware,
  type WrappedFunctionErrorWithObservable,
  type WrappedFunctionObservable,
} from '~/utils/middleware';
import { logLevelEnum } from '@chatally/enum';
import type { PrismaInstance } from '~/utils/db';
import {
  updateBeneficiaryInputSchema,
  type UpdateBeneficiaryInput,
  type UpdateBeneficiaryOutput,
} from '@chatally/api';

async function updateBeneficiary({
  input,
  requesterId,
  prisma,
}: {
  input: UpdateBeneficiaryInput;
  requesterId?: string | null;
  prisma: PrismaInstance;
}): Promise<
  | (UpdateBeneficiaryOutput & WrappedFunctionObservable)
  | WrappedFunctionErrorWithObservable
> {
  const parsedInput = updateBeneficiaryInputSchema.parse(input);
  const { workId, contractId, id, ...beneficiaryData } = parsedInput;
  const beneficiary = await prisma.beneficiary.update({
    where: {
      id,
    },
    data: {
      ...beneficiaryData,
      workId,
      entity:
        workId && contractId
          ? {
              connectOrCreate: {
                where: {
                  institution_workId: {
                    workId,
                    institution: contractId,
                  },
                },
                create: {
                  workId,
                  institution: contractId,
                },
              },
            }
          : undefined,
    },
  });

  return {
    type: 'response',
    status: 'SUCCESS',
    message: 'Beneficiary created successfully',
    data: {
      beneficiaryId: beneficiary.id,
      isActive: parsedInput.isActive,
    },
    log: {
      message: `User ${requesterId} updated beneficiary ${id} with workId ${workId} and contractId ${contractId}`,
      levelTypeId: logLevelEnum.ids.INFO,
      meta: {
        id,
        isActive: parsedInput.isActive,
      },
    },
  };
}

export default middleware(updateBeneficiary);
