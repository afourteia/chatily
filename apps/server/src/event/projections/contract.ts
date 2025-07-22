import { Prisma, PrismaClient } from '@salary/db/generated';
import { ContractEventData } from '~/event/event-data/contract';
import { Projections } from './index';
export const contractProjections: Projections<'contract'> = {
  create: createContract,
  update: updateContract,
};

function createContract(
  data: ContractEventData['create'],
  version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): [Prisma.Prisma__ContractClient<any, never, never, never>] {
  return [
    prisma.contract.create({
      data: {
        id: streamId,
        nameAr: data.nameAr,
        dalilUUID: data.dalilId,
        // dalilId: data.dalilId,
        isActive: data.isActive,
        // cityId: data.cityId,
      },
    }),
  ];
}

function updateContract(
  data: ContractEventData['update'],
  version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): [Prisma.Prisma__ContractClient<any, never, never, never>] {
  return [
    prisma.contract.update({
      where: { id: streamId },
      data: {
        nameAr: data.nameAr,
        dalilUUID: data.dalilId,
        isActive: data.isActive,
        // cityId: data.cityId,
      },
    }),
  ];
}
