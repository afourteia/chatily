import type {
  Arguments,
  Exact,
  GetOperations,
  ModelName,
  PostOperations,
  Results,
} from '@project-name/db';
import superjson, { type SuperJSONResult } from 'superjson';

import {
  keepPreviousData,
  useMutation,
  type UseMutationResult,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { queryClient } from '@/query-client';
import { AxiosError } from 'axios';
import { getAxios, postAxios } from './axios';
import {
  type ProcedureIO,
  procedureEndpointMap,
  type ProcedureEndpointMap,
} from '@project-name/api';

export type QueryKey<
  M extends ModelName,
  O extends PostOperations | GetOperations,
  A,
> = [M, O, A];

export const createTransactionObject = <
  M extends ModelName,
  O extends PostOperations | GetOperations,
  A extends Arguments<M, O>,
>(
  ModelName: M,
  operationName: O,
  args: Exact<A, M, O>,
): { ModelName: M; operationName: O; args: A } => {
  return { ModelName, operationName, args };
};

export const createDefaultQueryKey = <
  M extends ModelName,
  O extends PostOperations | GetOperations,
  A extends Arguments<M, O>,
>(
  model: M,
  operation: O,
  args: A,
): [M, O, A] => {
  return [model, operation, args];
};

// type QueryKey<
//   M extends string,
//   O extends string,
//   A extends object,
//   // M extends ModelName,
//   // O extends PostOperations | GetOperations,
//   // A extends Arguments<M, O>,
//   // A extends Exact<Arguments<M, O>, M, O>,
// > = [M, O, A];

export const defaultQueryFn = async <
  M extends ModelName,
  O extends GetOperations,
  A extends Arguments<M, O>,
>([model, operation, args]: readonly [M, O, Exact<A, M, O>]): Promise<{
  status: 'SUCCESS' | 'FAILURE';
  message: string;
  data: Results<M, A, O>;
}> => {
  const apiEndpoint = `/crud/${model}/${operation}`;
  return await getAxios(apiEndpoint, args);
};

export const defaultMutateFn = async <
  M extends ModelName,
  O extends PostOperations,
  A extends Arguments<M, O>,
>([model, operation, args]: readonly [M, O, Exact<A, M, O>]): Promise<{
  status: 'SUCCESS' | 'FAILURE';
  message: string;
  data: Results<M, A, O>;
}> => {
  const apiEndpoint = `/crud/${model}/${operation}`;
  return await postAxios(apiEndpoint, args);
};

export type MutateInput = Parameters<typeof defaultMutateFn>[0];

// export const mutationFunction = async <
//   M extends ModelName,
//   O extends PostOperations,
//   A extends Arguments<M, O>,
// >(
//   request: readonly [M, O, Exact<A, M, O>],
// ) => defaultMutateFn(request);

type transactionArgs = {
  ModelName: ModelName;
  operationName: PostOperations | GetOperations;
  args: unknown;
};

type transactionResponse<T extends readonly transactionArgs[]> = {
  status: 'SUCCESS' | 'FAILURE';
  message: string;
  data: {
    [K in keyof T]: Results<
      T[K]['ModelName'],
      T[K]['args'],
      T[K]['operationName']
    >;
  };
};

export const transactionFunction = async <T extends readonly transactionArgs[]>(
  input: T,
): Promise<transactionResponse<T>> => {
  const apiEndpoint = '/transaction';
  return await postAxios(apiEndpoint, input);
};

// export const defaultQueryFn = async ({ queryKey }: { queryKey: QueryKey }) => {
//   const apiEndpoint = `/crud/${queryKey[0]}/${queryKey[1]}`;
//   const { data } = await axiosInstance.get(apiEndpoint, {
//     params: { q: queryKey[2] }, // Pass query parameters here
//   });
//   return data;
// };

// export const defaultMutateFn = async ({
//   queryKey,
// }: {
//   queryKey: readonly unknown[];
// }) => {
//   const apiEndpoint = `/crud/${queryKey[0]}/${queryKey[1]}`;
//   const { data } = await axiosInstance.post(apiEndpoint, queryKey[2]);
//   return data;
// };

export const useProcedure = <T extends keyof ProcedureEndpointMap>({
  procedureEndpoint,
  ...functionArgs
}: {
  procedureEndpoint: T;
  onSuccess?: (data: ProcedureIO[T]['output']) => void;
  onSettled?: (data: ProcedureIO[T]['output'] | undefined) => void;
  onError?: (error: AxiosError) => void;
}): UseMutationResult<
  ProcedureIO[T]['output'],
  AxiosError,
  ProcedureIO[T]['input'],
  never
> => {
  return useMutation({
    mutationKey: [procedureEndpoint] as const,
    mutationFn: async (mutationReq) => {
      const apiEndpoint = `/procedure/${procedureEndpointMap[procedureEndpoint]}`;
      return await postAxios<ProcedureIO[T]['output']>(
        apiEndpoint,
        mutationReq,
      );
    },
    onSuccess: (data) => {
      // Invalidate the query for the model and operation
      queryClient.invalidateQueries();
    },
    ...functionArgs,
  });
};

export const useMutator = <
  M extends ModelName,
  O extends PostOperations,
  A extends Arguments<M, O>['include'],
>(
  modelName: M,
  operation: O,
  include?: A,
  functionArgs?: {
    onSuccess?: (
      data: Awaited<ReturnType<typeof defaultMutateFn<M, O, A>>>,
    ) => void;
    onSettled?: (
      data: Awaited<ReturnType<typeof defaultMutateFn<M, O, A>>> | undefined,
    ) => void;
    onError?: (error: Error) => void;
  },
) => {
  return useMutation({
    mutationKey: [modelName, operation] as const,
    mutationFn: (mutationReq: Arguments<M, O>) => {
      if (include) {
        mutationReq.include = include;
      }
      return defaultMutateFn([modelName, operation, mutationReq]);
    },
    onSuccess: () => {
      // Invalidate the query for the model and operation
      queryClient.invalidateQueries();
    },
    ...functionArgs,
  });
};

export const useTransaction = <T extends readonly transactionArgs[]>(
  transactions: T,
  functionArgs?: {
    onSuccess?: (data: transactionResponse<T>) => void;
    onSettled?: (data: transactionResponse<T> | undefined) => void;
    onError?: (error: Error) => void;
  },
) => {
  return useMutation({
    mutationKey: ['transactions'],
    mutationFn: () => transactionFunction(transactions),
    onSuccess: () => {
      // Invalidate the query for the model and operation
      queryClient.invalidateQueries();
    },
    ...functionArgs,
  });
};

export const useDbReader = <
  M extends ModelName,
  O extends GetOperations,
  A extends Arguments<M, O>,
  OB extends Arguments<M, O>['orderBy'],
  TResults extends any,
  QP extends Omit<
    UseQueryOptions<
      {
        status: 'SUCCESS' | 'FAILURE';
        message: string;
        data: Results<M, A, O>;
      },
      Error,
      TResults,
      readonly [M, O, A]
    >,
    'queryFn' | 'queryKey'
  >,
>(
  modelName: M,
  operation: O,
  args: A,
  orderBy?: OB,
  queryOptions?: QP,
): UseQueryResult<
  QP extends { select: any } ? ReturnType<QP['select']> : Results<M, A, O>,
  Error
> => {
  //@ts-ignore
  return useQuery({
    queryKey: [modelName, operation, { ...args, orderBy }],
    //@ts-ignore
    queryFn: ({ queryKey }) => defaultQueryFn(queryKey),
    select: (data) => data.data as any,
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
};

export const useSeeder = <
  T extends {
    status: 'SUCCESS' | 'FAILURE';
    message: string;
  },
>(): UseMutationResult<T, AxiosError, undefined, never> => {
  return useMutation<T, AxiosError, undefined, never>({
    mutationKey: ['Seeder'] as const,
    mutationFn: () => postAxios<T>('/seed', undefined),
    onSuccess: () => {
      // Invalidate the query for the model and operation
      queryClient.invalidateQueries();
    },
  });
};
