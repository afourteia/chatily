import { Prisma, PrismaClient } from '@salary/db/generated';
import { ProductionEventEventData } from '~/event/event-data/production-event';
import { Projections } from './index';
import { getCreatorId, getCreatorObject } from '~/utils/creator';
import { createCUID } from '~/utils/id';
export const productionEventProjections: Projections<'productionEvent'> = {
  create,
  updateEventStatus,
  remove,
};

function create(
  data: ProductionEventEventData['create'],
  _version: bigint,
  streamId: string,
  requestorId: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): Promise<unknown>[] {
  return [
    prisma.productionEvent.create({
      data: {
        id: streamId,
        eventTemplate: { connect: { id: data.productionTemplateId } },
        date: data.productionDate,
        quantity: data.quantity,
        isManuallyAdded: data.isManuallyAdded,
        reviewStatus: {
          connect: { id: data.reviewStatusId },
        },
        productionContributors: {
          createMany: {
            data: Object.entries(data.contributors).map(
              ([contributorId, contributorData]) => ({
                unitPrice: contributorData.price.toString(),
                employeeId: contributorId,
                reviewStatusId: contributorData.reviewStatusId,
                wageAgreementId: contributorData.wageAgreementId,
                compensationAgreementId:
                  contributorData.compensationAgreementId,
                ...getCreatorId(requestorId),
              }),
            ),
          },
        },
        associatedParameters: {
          createMany: {
            data: Object.entries(data.parameters).map(
              ([parameterId, parameterData]) => ({
                parameterValue: parameterData.parameterValue,
                parameterTypeId: parameterId,
                ...getCreatorId(requestorId),
              }),
            ),
          },
        },
        ...getCreatorObject(requestorId),
      },
    }),
  ];
}
// ...getCreatorObject(requestorId),
