import { AggregateEventMap } from '~/event/aggregate-map';
type DepartmentData = {
  id: string;
  nameAr: string;
  managerId: string;
  isActive: boolean;
};

// Get the union of event names for department
type DepartmentEventNames = AggregateEventMap['department'];

// Map each event name to its data shape
export interface DepartmentEventDataMap {
  create: DepartmentData;
  update: Partial<DepartmentData>;
}

// Enforce that all event names in the map are present in the data interface
export type DepartmentEventData = {
  [K in DepartmentEventNames]: DepartmentEventDataMap[K];
};
