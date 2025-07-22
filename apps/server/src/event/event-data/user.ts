import { AggregateEventMap } from '~/event/aggregate-map';
type UserData = {
  name: string;
  isActive: boolean;
  phoneVerifiedAt?: Date;
  passwordHash?: string;
  deviceTokens?: Record<
    string,
    {
      deviceToken: string;
      deviceType: 'ios' | 'android' | 'web';
    }
  >;
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
  updateDeviceTokens:
    | {
        changeType: 'remove';
        deviceToken: string;
      }
    | {
        changeType: 'add';
        deviceToken: string;
        deviceType: 'ios' | 'android' | 'web';
      };
  updatePhoneVerifiedAt: {
    phoneVerifiedAt: Date | null; // null if clearing the verified date
  };
}

// Enforce that all event names in the map are present in the data interface
export type UserEventData = {
  [K in UserEventNames]: UserEventDataMap[K];
};
