import { Prisma, PrismaClient } from '@salary/db/generated';
import { AggregateEventMap } from '../aggregate-map';
import { ChangeForm, EventData } from '../event-data';
import { healthcareFacilityProjections } from './healthcare-facility';
import { contractProjections } from './contract';
import { departmentProjections } from './department';
import { employeeProjections } from './employee';

export type Projections<A extends keyof EventData> = {
  [ET in AggregateEventMap[A]]: (
    data: any,
    version: bigint,
    streamId: string,
    requestorId: string,
    prisma: PrismaClient | Prisma.TransactionClient,
  ) => Array<Promise<any>>;
};

export const projections: {
  [K in keyof EventData]: Projections<K>;
} = {
  contract: contractProjections,
  healthcareFacility: healthcareFacilityProjections,
  department: departmentProjections,
  // user: userProjections,
  employee: employeeProjections,
  // payrollRecord: payrollRecordProjections,
};

export function processChange<T>(change?: ChangeForm<T>): T | null | undefined {
  if (!change || change.changeType === 'unchanged') return undefined;
  if (change.changeType === 'clear') return null;

  return change.newValue;
}
