import { AggregateEventMap } from '~/event/aggregate-map';
import { reviewStatusEnum } from '@salary/enums';
import Decimal from 'decimal.js';
type ProductionEventData = {
  productionTemplateId: string;
  parameters: Record<
    string,
    {
      parameterValue: string;
    }
  >;
  productionDate: Date;
  quantity: number;
  isManuallyAdded: boolean;
  reviewStatusId: (typeof reviewStatusEnum.ids)[keyof typeof reviewStatusEnum.ids];
  contributors: Record<
    string,
    {
      price: Decimal;
      reviewStatusId: (typeof reviewStatusEnum.ids)[keyof typeof reviewStatusEnum.ids];
      wageAgreementId: string;
      compensationAgreementId: string;
    }
  >;
  reasonForRemoval?: string;
};

// Get the union of event names for productionEvent
type ProductionEventEventNames = AggregateEventMap['productionEvent'];

// Map each event name to its data shape
export interface ProductionEventDataMap {
  create: ProductionEventData;
  updateEventStatus: {
    productionReviewStatusId?: (typeof reviewStatusEnum.ids)[keyof typeof reviewStatusEnum.ids];
    reason?: string;
    contributors: Record<
      string,
      {
        reviewStatusId: (typeof reviewStatusEnum.ids)[keyof typeof reviewStatusEnum.ids];
        reason?: string;
      }
    >;
  };
  remove: {
    reason: string;
  };
}

// Enforce that all event names in the map are present in the data interface
export type ProductionEventEventData = {
  [K in ProductionEventEventNames]: ProductionEventDataMap[K];
};
