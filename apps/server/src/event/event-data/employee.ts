import { AggregateEventMap } from '~/event/aggregate-map';
import { activeStatusEnum } from '@salary/enums';
import { ChangeTracker, Prettify } from './index';
type EmployeeData = {
  employeeNumber: number;
  firstName: string;
  secondName?: string;
  thirdName?: string;
  fourthName?: string;
  lastName: string;
  phoneNumber: string;
  departmentId: string;
  departmentSalaryReview?: string[];
  departmentProductionReview?: string[];
  accountId?: string;
  status?: (typeof activeStatusEnum.ids)[keyof typeof activeStatusEnum.ids];
  dalilCred: {
    attendanceId?: number;
    dalilId?: number;
    dalilUsername?: string;
    labId?: number;
    labUsername?: string;
    staffId?: string;
  };
};

// Get the union of event names for employee
type EmployeeEventNames = AggregateEventMap['employee'];

// Map each event name to its data shape
export interface EmployeeEventDataMap {
  create: EmployeeData;
  updateActiveStatus: {
    status: (typeof activeStatusEnum.ids)[keyof typeof activeStatusEnum.ids];
  };
  updateDalilCred: Prettify<ChangeTracker<EmployeeData['dalilCred']>>;
  updateName: Pick<
    EmployeeData,
    'firstName' | 'secondName' | 'thirdName' | 'fourthName' | 'lastName'
  >;
  connectAccount: {
    accountId: string | null; // null if disconnecting
  };
  updateProductionReviewPermission: {
    change: Record<
      string,
      {
        changeType: 'add' | 'remove';
      }
    >;
  };
  updateSalaryReviewPermission: {
    change: Record<
      string,
      {
        changeType: 'add' | 'remove';
      }
    >;
  };
}

// Enforce that all event names in the map are present in the data interface
export type EmployeeEventData = {
  [K in EmployeeEventNames]: EmployeeEventDataMap[K];
};
