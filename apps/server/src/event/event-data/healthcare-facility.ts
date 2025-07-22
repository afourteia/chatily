import { AggregateEventMap } from '~/event/aggregate-map';
type HealthcareFacilityData = {
  id: string;
  nameAr: string;
  dalilId: string;
  isActive: boolean;
  cityId: string;
};

// Get the union of event names for healthcareFacility
type HealthcareFacilityEventNames = AggregateEventMap['healthcareFacility'];

// Map each event name to its data shape
export interface HealthcareFacilityEventDataMap {
  create: HealthcareFacilityData;
  update: Partial<HealthcareFacilityData>;
}

// Enforce that all event names in the map are present in the data interface
export type HealthcareFacilityEventData = {
  [K in HealthcareFacilityEventNames]: HealthcareFacilityEventDataMap[K];
};
