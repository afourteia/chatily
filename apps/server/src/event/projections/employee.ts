import { Prisma, PrismaClient } from '@salary/db/generated';
import { EmployeeEventData } from '~/event/event-data/employee';
import { processChange, Projections } from './index';
import { activeStatusEnum } from '@salary/enums';
import { generateNameObject } from '~/utils/nameObject';
import { getCreatorObject, getUpdaterObject } from '~/utils/creator';
export const employeeProjections: Projections<'employee'> = {
  create,
  updateActiveStatus,
  updateDalilCred,
  connectAccount,
  updateProductionReviewPermission,
  updateSalaryReviewPermission,

  //    connectAccount:
};

function create(
  data: EmployeeEventData['create'],
  _version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): [Prisma.Prisma__EmployeeClient<any, never, never, never>] {
  return [
    prisma.employee.create({
      data: {
        id: streamId,
        phone: data.phoneNumber,
        activeStatus: {
          connect: { id: data.status ?? activeStatusEnum.ids.PENDING },
        },
        ...generateNameObject({
          firstName: data.firstName,
          secondName: data.secondName,
          thirdName: data.thirdName,
          fourthName: data.fourthName,
          lastName: data.lastName,
        }),
        dalilCredential: {
          create: {
            attendanceDeviceId: data.dalilCred.attendanceId,
            dalId: data.dalilCred.dalilId,
            dalUsername: data.dalilCred.dalilUsername,
            labId: data.dalilCred.labId,
            labUsername: data.dalilCred.labUsername,
            staffId: data.dalilCred.staffId,
            ...getCreatorObject(requestorId),
          },
        },
        ...getCreatorObject(requestorId),
      },
    }),
  ];
}

function updateActiveStatus(
  data: EmployeeEventData['updateActiveStatus'],
  _version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): [Prisma.Prisma__EmployeeClient<any, never, never, never>] {
  return [
    prisma.employee.update({
      where: { id: streamId },
      data: {
        activeStatus: {
          connect: { id: data.status },
        },
        ...getUpdaterObject(requestorId),
      },
    }),
  ];
}

function updateDalilCred(
  data: EmployeeEventData['updateDalilCred'],
  _version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): [Prisma.Prisma__EmployeeDalilCredentialClient<any, never, never, never>] {
  return [
    prisma.employeeDalilCredential.update({
      where: { id: streamId },
      data: {
        labId: processChange(data.labId),
        labUsername: processChange(data.labUsername),
        attendanceDeviceId: processChange(data.attendanceId),
        dalId: processChange(data.dalilId),
        dalUsername: processChange(data.dalilUsername),
        staffId: processChange(data.staffId),
        ...getUpdaterObject(requestorId),
      },
    }),
  ];
}

function connectAccount(
  data: EmployeeEventData['connectAccount'],
  _version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): [Prisma.Prisma__EmployeeClient<any, never, never, never>] {
  return [
    prisma.employee.update({
      where: { id: streamId },
      data: {
        userId: data.accountId,
        updaterId: requestorId,
      },
    }),
  ];
}

function updateProductionReviewPermission(
  data: EmployeeEventData['updateProductionReviewPermission'],
  _version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): Promise<unknown>[] {
  return [
    ...Object.entries(data.change)
      .filter((predicate) => predicate[1].changeType === 'remove')
      .map(([permissionId]) =>
        prisma.employeeProductionEventReviewer.delete({
          where: {
            employeeId_productionEventTemplateId: {
              productionEventTemplateId: permissionId,
              employeeId: streamId,
            },
          },
        }),
      ),
    prisma.employeeProductionEventReviewer.createMany({
      data: Object.entries(data.change)
        .filter((predicate) => predicate[1].changeType === 'add')
        .map(([permissionId]) => ({
          employeeId: streamId,
          productionEventTemplateId: permissionId,
          creatorId: requestorId,
        })),
    }),
  ];
}

function updateSalaryReviewPermission(
  data: EmployeeEventData['updateSalaryReviewPermission'],
  _version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): Promise<unknown>[] {
  return [
    ...Object.entries(data.change)
      .filter((predicate) => predicate[1].changeType === 'remove')
      .map(([permissionId]) =>
        prisma.departmentSalaryReviewer.delete({
          where: {
            departmentId_reviewerId: {
              departmentId: permissionId,
              reviewerId: streamId,
            },
          },
        }),
      ),
    prisma.departmentSalaryReviewer.createMany({
      data: Object.entries(data.change)
        .filter((predicate) => predicate[1].changeType === 'add')
        .map(([permissionId]) => ({
          reviewerId: streamId,
          departmentId: permissionId,
          creatorId: requestorId,
        })),
    }),
  ];
}
