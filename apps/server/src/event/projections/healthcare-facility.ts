import { Prisma, PrismaClient } from '@salary/db/generated';
import { HealthcareFacilityEventData } from '~/event/event-data/healthcare-facility';
import { AggregateEventMap } from '~/event/aggregate-map';
import { Projections } from './index';
export const healthcareFacilityProjections: Projections<'healthcareFacility'> =
  // {
  //     [K in AggregateEventMap['healthcareFacility']]: (
  //         data: HealthcareFacilityEventData[K],
  //         version: bigint,
  //         prisma: PrismaClient | Prisma.TransactionClient
  //     ) => Promise<any>;
  // }
  {
    create: createHealthcareFacility,
    update: updateHealthcareFacility,
  };

function createHealthcareFacility(
  data: HealthcareFacilityEventData['create'],
  version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): [Prisma.Prisma__HealthCareFacilityClient<any, never, never, never>] {
  return [
    prisma.healthCareFacility.create({
      data: {
        id: streamId,
        nameAr: data.nameAr,
        dalilUUID: data.dalilId,
        // dalilCode: data.
        isActive: data.isActive,
        cityId: data.cityId,
      },
    }),
  ];
}

function updateHealthcareFacility(
  data: HealthcareFacilityEventData['update'],
  version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): [Prisma.Prisma__HealthCareFacilityClient<any, never, never, never>] {
  return [
    prisma.healthCareFacility.update({
      where: { id: streamId },
      data: {
        nameAr: data.nameAr,
        dalilId: data.dalilId,
        isActive: data.isActive,
        cityId: data.cityId,
      },
    }),
  ];
}
