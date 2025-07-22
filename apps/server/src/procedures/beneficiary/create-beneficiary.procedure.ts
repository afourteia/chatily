import {
  middleware,
  type WrappedFunctionErrorWithObservable,
  type WrappedFunctionObservable,
} from '~/utils/middleware';
import { logLevelEnum } from '@project-name/enum';
import type { PrismaInstance } from '~/utils/db';
import {
  createBeneficiaryInputSchema,
  type CreateBeneficiaryInput,
  type CreateBeneficiaryOutput,
} from '@project-name/api';

async function createBeneficiary({
  input,
  requesterId,
  prisma,
}: {
  input: CreateBeneficiaryInput;
  requesterId?: string | null;
  prisma: PrismaInstance;
}): Promise<
  | (CreateBeneficiaryOutput & WrappedFunctionObservable)
  | WrappedFunctionErrorWithObservable
> {
  const parsedInput = createBeneficiaryInputSchema.parse(input);
  const { workId, contractId, ...beneficiaryData } = parsedInput;
  await prisma.beneficiary.upsert({
    where: {
      id: parsedInput.id,
    },
    create: {
      ...beneficiaryData,
      workId,
      entity: {
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
      },
    },
    update: {
      ...beneficiaryData,
      workId,
      entity: {
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
      },
    },
  });

  return {
    type: 'response',
    status: 'SUCCESS',
    message: 'Beneficiary created successfully',
    data: {
      beneficiaryId: parsedInput.id,
    },
    log: {
      message: `User ${requesterId} created beneficiary ${parsedInput.id} with workId ${parsedInput.workId} and contractId ${parsedInput.contractId}`,
      levelTypeId: logLevelEnum.ids.INFO,
      meta: {
        id: parsedInput.id,
        isActive: parsedInput.isActive,
      },
    },
  };
}

export default middleware(createBeneficiary);
