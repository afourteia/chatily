import { AggregateEventMap } from '~/event/aggregate-map';
type ContractData = {
  id: string;
  nameAr: string;
  dalilId: string;
  dalilCode: string;
  isActive: boolean;
};

// Get the union of event names for contract
type ContractEventNames = AggregateEventMap['contract'];

// Map each event name to its data shape
export interface ContractEventDataMap {
  create: ContractData;
  update: Partial<ContractData>;
}

// Enforce that all event names in the map are present in the data interface
export type ContractEventData = {
  [K in ContractEventNames]: ContractEventDataMap[K];
};
