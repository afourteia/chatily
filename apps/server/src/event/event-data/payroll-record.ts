import { AggregateEventMap } from '~/event/aggregate-map';
type UserData = {
  name: string;
  isActive: boolean;
  phoneVerifiedAt?: Date;
  passwordHash?: string;
  deviceTokens?: string[];
};

// Get the union of event names for user
type UserEventNames = AggregateEventMap['user'];

// Map each event name to its data shape
export interface UserEventDataMap {
  create: UserData;
  updateActiveStatus: {
    isActive: boolean;
  };
  updatePassword: {
    passwordHash: string;
  };
}

// Enforce that all event names in the map are present in the data interface
export type UserEventData = {
  [K in UserEventNames]: UserEventDataMap[K];
};
