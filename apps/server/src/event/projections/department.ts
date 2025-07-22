import { Prisma, PrismaClient } from '@salary/db/generated';
import { DepartmentEventData } from '~/event/event-data/department';
import { Projections } from './index';
export const departmentProjections: Projections<'department'> = {
  create: createDepartment,
  update: updateDepartment,
};

function createDepartment(
  data: DepartmentEventData['create'],
  version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): [Prisma.Prisma__DepartmentClient<any, never, never, never>] {
  return [
    prisma.department.create({
      data: {
        id: streamId,
        nameAr: data.nameAr,
        isActive: data.isActive,
      },
    }),
  ];
}

function updateDepartment(
  data: DepartmentEventData['update'],
  version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): [Prisma.Prisma__DepartmentClient<any, never, never, never>] {
  return [
    prisma.department.update({
      where: { id: streamId },
      data: {
        nameAr: data.nameAr,
        isActive: data.isActive,
        // cityId: data.cityId,
      },
    }),
  ];
}
