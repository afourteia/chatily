import {
  middleware,
  type WrappedFunctionErrorWithObservable,
  type WrappedFunctionObservable,
} from '~/utils/middleware';
import { logLevelEnum } from '@project-name/enum';
import type { PrismaInstance } from '~/utils/db';
import {
  viewBeneficiaryEntityInputSchema,
  type ViewBeneficiaryEntityInput,
  type ViewBeneficiaryEntityOutput,
} from '@project-name/api';

async function viewBeneficiaryEntity({
  input,
  requesterId,
  prisma,
}: {
  input: ViewBeneficiaryEntityInput;
  requesterId?: string | null;
  prisma: PrismaInstance;
}): Promise<
  | (ViewBeneficiaryEntityOutput & WrappedFunctionObservable)
  | WrappedFunctionErrorWithObservable
> {
  const parsedInput = viewBeneficiaryEntityInputSchema.parse(input);
  const beneficiaryEntity = await prisma.beneficiaryEntity.findUnique({
    where: {
      institution_workId: {
        workId: parsedInput.workId,
        institution: parsedInput.contractId,
      },
    },
    include: {
      beneficiaries: true,
    },
  });

  return {
    type: 'response',
    status: 'SUCCESS',
    message: 'Login successful',
    data: beneficiaryEntity,
    log: {
      message: `User ${requesterId} viewed beneficiary Entity ${beneficiaryEntity?.id ?? 'NULL'} with workId ${parsedInput.workId} and contractId ${parsedInput.contractId}`,
      levelTypeId: logLevelEnum.ids.INFO,
      meta: {
        beneficiaryEntityId: beneficiaryEntity?.id,
        workId: parsedInput.workId,
        contractId: parsedInput.contractId,
        requesterId: requesterId,
      },
    },
  };
}

export default middleware(viewBeneficiaryEntity);
