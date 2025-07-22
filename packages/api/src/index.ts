export * from './user';
export * from './beneficiary';

import * as user from './user';
import * as beneficiary from './beneficiary';

export const procedureEndpointList = [
  'login',
  'refresh-access-token',
  'request-otp',
  'create-user',
  'update-user',
  'update-user-password',
  'validate-otp',
  'view-beneficiary-entity',
  'view-beneficiary',
  'update-beneficiary',
  'create-beneficiary',
] as const;

export type ProcedureEndPoint = (typeof procedureEndpointList)[number];
export const procedureEndpointMap = {
  login: 'login',
  refreshAccessToken: 'refresh-access-token',
  requestOtp: 'request-otp',
  createUser: 'create-user',
  updateUser: 'update-user',
  updateUserPassword: 'update-user-password',
  validateOtp: 'validate-otp',
  viewBeneficiaryEntity: 'view-beneficiary-entity',
  viewBeneficiary: 'view-beneficiary',
  updateBeneficiary: 'update-beneficiary',
  createBeneficiary: 'create-beneficiary',
} satisfies Record<keyof ProcedureIO, ProcedureEndPoint>;
export type ProcedureEndpointMap = typeof procedureEndpointMap;

export interface WrappedFunctionResponse<T = unknown> {
  type: 'response';
  status: 'SUCCESS' | 'FAILURE';
  message: string;
  data: T;
}

export interface ProcedureIO {
  login: {
    input: user.LoginInput;
    output: user.LoginOutput;
  };
  refreshAccessToken: {
    input: user.RefreshAccessTokenInput;
    output: user.RefreshAccessTokenOutput;
  };
  requestOtp: {
    input: user.RequestOtpInput;
    output: user.RequestOtpOutput;
  };
  createUser: {
    input: user.CreateUserInput;
    output: user.CreateUserOutput;
  };
  updateUser: {
    input: user.UpdateUserInput;
    output: user.UpdateUserOutput;
  };
  updateUserPassword: {
    input: user.UpdateUserPasswordInput;
    output: user.UpdateUserPasswordOutput;
  };
  validateOtp: {
    input: user.ValidateOtpInput;
    output: user.ValidateOtpOutput;
  };
  viewBeneficiaryEntity: {
    input: beneficiary.ViewBeneficiaryEntityInput;
    output: beneficiary.ViewBeneficiaryEntityOutput;
  };
  viewBeneficiary: {
    input: beneficiary.ViewBeneficiaryInput;
    output: beneficiary.ViewBeneficiaryOutput;
  };
  updateBeneficiary: {
    input: beneficiary.UpdateBeneficiaryInput;
    output: beneficiary.UpdateBeneficiaryOutput;
  };
  createBeneficiary: {
    input: beneficiary.CreateBeneficiaryInput;
    output: beneficiary.CreateBeneficiaryOutput;
  };
}

// Ensure that the procedureEndpointMap keys are consistent with the ProcedureIO keys
// type ProcedureIOKey = keyof typeof procedureEndpointMap;
// type ProcedureIOValue = ProcedureIO[ProcedureIOKey];
// type ProcedureEndpointMapKey = keyof ProcedureIO;
// type ProcedureEndpointMapValue = ProcedureEndpointMap[ProcedureEndpointMapKey];
