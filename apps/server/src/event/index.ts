import { AggregateEventMap } from '~/event/aggregate-map';
import { EventData } from '~/event/event-data';
import prisma from '~/utils/db';
import { ServerError } from '~/utils/error';
import { projections as getProjections } from './projections';
import pLimit from 'p-limit';

// Overloads
export async function emitEvent<
  A extends keyof AggregateEventMap,
  ET extends AggregateEventMap[A],
>(
  aggregateRoot: A,
  eventType: ET,
  streamId: string,
  eventData: EventData[A][ET],
  requestorId: string,
  requestId: string,
): Promise<void>;
export async function emitEvent<
  A extends keyof AggregateEventMap,
  ET extends AggregateEventMap[A],
>(
  aggregateRoot: A,
  eventType: ET,
  streamId: string[],
  eventData: EventData[A][ET] | EventData[A][ET][],
  requestorId: string,
  requestId: string,
): Promise<void>;

export async function emitEvent<
  A extends keyof AggregateEventMap,
  ET extends AggregateEventMap[A],
>(
  aggregateRoot: A,
  eventType: ET,
  streamId: string | string[],
  eventData: EventData[A][ET] | EventData[A][ET][],
  requestorId: string,
  requestId: string,
): Promise<void> {
  // Emit the event
  console.log(
    `Emitting event: ${eventType} for aggregate: ${aggregateRoot} with streamId: ${streamId}`,
  );
  // use requestId to enforce idempotency

  try {
    await prisma.commandLog.create({
      data: {
        id: requestId,
        creatorId: requestorId,
      },
    });
  } catch (error) {
    console.error(`Error emitting event: ${error}`);
    throw new ServerError({
      code: 'INVALID_SUBMISSION',
      message: `Failed to emit event with requestId: ${requestId}. It may have already been processed.`,
    });
  }

  // TODO: add a retry loop
  if (!Array.isArray(streamId)) {
    if (Array.isArray(eventData)) {
      throw new Error(
        'eventData should not be an array when streamId is a string',
      );
    }
    const lastStream = await prisma.eventStore.findFirst({
      where: {
        aggregateType: aggregateRoot,
        aggregateId: streamId,
      },
      orderBy: {
        version: 'desc',
      },
      select: {
        id: true,
        version: true,
      },
    });
    const newStreamVersion = lastStream ? lastStream.version + 1n : 1n;
    await prisma.$transaction(async (tx) => {
      const insertEvent = tx.eventStore.create({
        data: {
          aggregateType: aggregateRoot,
          eventType: eventType,
          aggregateId: streamId,
          version: newStreamVersion,
          eventData,
          creatorId: requestorId,
        },
      });
      const projections = getProjections[aggregateRoot][eventType](
        eventData as any, //TODO: type assertion to match the projection function signature
        newStreamVersion,
        streamId,
        requestorId,
        tx,
      );
      await Promise.all([
        insertEvent,
        ...projections,
        // TODO: update commandLog
      ]);
    });
  } else {
    const promiseLimit = pLimit(50);
    const transactionLimit = pLimit(100);
    if (Array.isArray(eventData)) {
      if (eventData.length !== streamId.length) {
        throw new Error(
          'eventData and streamId arrays must have the same length',
        );
      }
      const events = await Promise.all(
        streamId.map((sId, index) =>
          promiseLimit(async () => {
            const lastStream = await prisma.eventStore.findFirst({
              where: {
                aggregateType: aggregateRoot,
                aggregateId: sId,
              },
              orderBy: {
                version: 'desc',
              },
              select: {
                id: true,
                version: true,
              },
            });
            const newStreamVersion = lastStream ? lastStream.version + 1n : 1n;

            return {
              aggregateType: aggregateRoot,
              eventType: eventType,
              aggregateId: sId,
              version: newStreamVersion,
              eventData: eventData[index],
              creatorId: requestorId,
            };
          }),
        ),
      );
      console.log('Events to be inserted:', events);

      await prisma.$transaction(async (tx) => {
        const insertEvent = transactionLimit(() =>
          tx.eventStore.createMany({
            data: events,
          }),
        );
        const projections = events.map((event) =>
          transactionLimit(() =>
            Promise.all(
              getProjections[aggregateRoot][eventType](
                event.eventData as any,
                event.version,
                event.aggregateId,
                requestorId,
                tx,
              ),
            ),
          ),
        );
        // const projections = events.flatMap((event) =>
        //   getProjections[aggregateRoot][eventType](
        //     event.eventData as any,
        //     event.version,
        //     event.aggregateId,
        //     requestorId,
        //     tx,
        //   ).map((projectionPromise) =>
        //     transactionLimit(() => projectionPromise),
        //   ),
        // );
        const result = await Promise.all([
          insertEvent,
          ...projections,
          // TODO: update commandLog
        ]);
        console.log('Events and projections processed successfully:', result);
      });
    } else {
      const events = await Promise.all(
        streamId.map((sId) =>
          promiseLimit(async () => {
            const lastStream = await prisma.eventStore.findFirst({
              where: {
                aggregateType: aggregateRoot,
                aggregateId: sId,
              },
              orderBy: {
                version: 'desc',
              },
              select: {
                id: true,
                version: true,
              },
            });
            const newStreamVersion = lastStream ? lastStream.version + 1n : 1n;

            return {
              aggregateType: aggregateRoot,
              eventType: eventType,
              aggregateId: sId,
              version: newStreamVersion,
              eventData,
              creatorId: requestorId,
            };
          }),
        ),
      );

      console.log('Events to be inserted:', events);

      await prisma.$transaction(async (tx) => {
        const insertEvent = transactionLimit(() =>
          tx.eventStore.createMany({
            data: events,
          }),
        );
        const projections = events.map((event) =>
          transactionLimit(() =>
            Promise.all(
              getProjections[aggregateRoot][eventType](
                event.eventData as any,
                event.version,
                event.aggregateId,
                requestorId,
                tx,
              ),
            ),
          ),
        );
        await Promise.all([
          insertEvent,
          ...projections,
          // TODO: update commandLog
        ]);
      });
    }
    // TODO: update commandLog
  }
}
