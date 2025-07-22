import { Router } from 'express';
import superjson from 'superjson';
import updateUser from '~/procedures/user/update-user.procedure';
import changePassword from '~/procedures/user/change-password.procedure';
// import createUser from '~/procedures/user/create-user.procedure';
import login from '~/procedures/user/login.procedure';
import refreshAccessToken from '~/procedures/user/refresh-access-token.procedure';
import requestOtp from '~/procedures/user/request-otp.procedure';
import validateOtp from '~/procedures/user/validate-otp.procedure';
import viewBeneficiaryEntity from '~/procedures/beneficiary/view-beneficiary-entity.procedure';
import createBeneficiary from '~/procedures/beneficiary/create-beneficiary.procedure';
import updateBeneficiary from '~/procedures/beneficiary/update-beneficiary.procedure';
import { ServerError } from '~/utils/error';
import {
  procedureEndpointList,
  type ProcedureEndPoint,
} from '@project-name/api';
const procedureRouter: Router = Router();

type ProcedureDetails = {
  [key in ProcedureEndPoint]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    invoke: (req: any, res: any, input: any, options?: any) => Promise<any>;
    bypassAuth?: boolean;
    bypassAuthz?: boolean;
  };
};
const procedures: ProcedureDetails = {
  login: {
    invoke: login,
    bypassAuth: true,
  },
  'refresh-access-token': {
    invoke: refreshAccessToken,
    bypassAuth: true,
  },
  'request-otp': {
    invoke: requestOtp,
    bypassAuth: true,
  },
  'create-beneficiary': {
    invoke: createBeneficiary,
    bypassAuth: false,
    bypassAuthz: false,
  },
  'update-beneficiary': {
    invoke: updateBeneficiary,
    bypassAuth: false,
    bypassAuthz: false,
  },
  'view-beneficiary': {
    invoke: throwNotImplemented,
    bypassAuth: false,
  },
  'view-beneficiary-entity': {
    invoke: viewBeneficiaryEntity,
    bypassAuth: false,
  },
  'create-user': {
    invoke: throwNotImplemented,
    bypassAuth: false,
    bypassAuthz: false,
  },
  // 'create-user': {
  //   invoke: createUser,
  //   bypassAuth: false,
  //   bypassAuthz: true,
  // },
  'update-user': {
    invoke: updateUser,
  },
  'update-user-password': {
    invoke: changePassword,
    bypassAuthz: true,
  },
  'validate-otp': {
    invoke: validateOtp,
    bypassAuth: true,
  },
};

async function throwNotImplemented() {
  throw new ServerError({
    message: 'Not implemented',
    code: 'NOT_IMPLEMENTED',
    level: 'ERROR',
    log: {
      message: 'Not implemented',
      meta: {
        procedureName: 'add-compensation-agreement',
        method: 'POST',
      },
    },
  });
}
procedureRouter.post('/:procedure', async (req, res, next) => {
  try {
    const input = superjson.deserialize(req.body);
    const procedureName = req.params.procedure as ProcedureEndPoint;
    if (!procedureEndpointList.includes(procedureName)) {
      throw new ServerError({
        message: `Procedure ${procedureName} not found`,
        code: 'NOT_FOUND',
        level: 'ERROR',
        log: {
          message: `Procedure ${procedureName} not found`,
          meta: {
            procedureName,
            method: req.method,
          },
        },
      });
    }
    await procedures[procedureName].invoke(req, res, input, {
      bypassAuth: procedures[procedureName].bypassAuth,
      bypassAuthz: procedures[procedureName].bypassAuthz,
    });
  } catch (err) {
    next(err);
  }
});

export default procedureRouter;
