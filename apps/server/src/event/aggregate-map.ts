type CommonEvent = 'create' | 'update'; // | 'softDelete' | 'restore';

export interface AggregateEventMap {
  healthcareFacility: CommonEvent;
  contract: CommonEvent;
  department: CommonEvent;
  user:
    | 'create'
    | 'updateActiveStatus'
    | 'updatePassword'
    | 'updateDeviceTokens'
    | 'updatePhoneVerifiedAt';
  employee:
    | 'create'
    | 'updateActiveStatus'
    | 'updateDalilCred'
    | 'connectAccount'
    | 'updateProductionReviewPermission'
    | 'updateSalaryReviewPermission';
  productionEvent: 'create' | 'updateEventStatus' | 'remove';
  // payrollRecord:
  //   | 'create'
  //   | 'adjustPayroll'
  //   | 'updateCalculation'
  //   | 'updateAcknowledgment'
  //   | 'updateStatus';
  // productionTemplate: CommonEvent;
  // salaryTemplate: CommonEvent;
  // workAssignment: 'create' | 'decide' | 'updateProgress' | 'updateReview';
  // salaryAgreement: CommonEvent;
  // wageAgreement: CommonEvent;
}
