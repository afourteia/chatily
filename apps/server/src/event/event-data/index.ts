import { AggregateEventMap } from '~/event/aggregate-map';
import { HealthcareFacilityEventData } from '~/event/event-data/healthcare-facility';
import { ContractEventData } from './contract';
import { DepartmentEventData } from './department';
import { EmployeeEventData } from './employee';
import { UserEventData } from './user';

export type HealthcareFacilityEvent = AggregateEventMap['healthcareFacility'];
// export type HealthcareFacilityEventData = HealthcareFacilityEventData[HealthcareFacilityEvent];
export type EventData = {
  healthcareFacility: HealthcareFacilityEventData;
  contract: ContractEventData; // Replace with actual type
  department: DepartmentEventData; // Replace with actual type
  user: UserEventData; // Replace with actual type
  employee: EmployeeEventData; // Replace with actual type
  // payrollRecord: HealthcareFacilityEventData; // Replace with actual type
  // productionEvent: HealthcareFacilityEventData; // Replace with actual type

  // productionTemplate: HealthcareFacilityEventData; // Replace with actual type
  // salaryTemplate: HealthcareFacilityEventData; // Replace with actual type

  // workAssignment: HealthcareFacilityEventData; // Replace with actual type
  // salaryAgreement: HealthcareFacilityEventData; // Replace with actual type
  // wageAgreement: HealthcareFacilityEventData; // Replace with actual type
};

export type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type NullableAndOptional<T> = {
  [K in keyof T]: T[K] | null | undefined;
};
export type ChangeTracker<T> = {
  [K in keyof T]?: ChangeForm<T[K]>;
};
export type ChangeForm<T> =
  | {
      changeType: 'change';
      oldValue: T | null;
      newValue: T;
    }
  | {
      changeType: 'clear';
      oldValue: T | null;
    }
  | {
      changeType: 'unchanged';
      oldValue: T | null;
    };
