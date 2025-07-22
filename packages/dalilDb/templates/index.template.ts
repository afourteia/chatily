/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import type { Prisma } from '@prisma/generated';

export type ModelName = Prisma.ModelName;
export const modelNameObj = {} as const;
export type GetOperations =
  | 'findFirst'
  | 'findFirstOrThrow'
  | 'findUnique'
  | 'findUniqueOrThrow'
  | 'findMany'
  | 'aggregate'
  | 'count'
  | 'groupBy';

export type PostOperations =
  | 'create'
  | 'createMany'
  | 'createManyAndReturn'
  | 'update'
  | 'updateMany'
  | 'upsert'
  | 'delete'
  | 'deleteMany';

export type ApiEndpoint =
  `/crud/${ModelName}/${PostOperations | GetOperations}`;

export type Delegates = {};

export type Arguments<
  T extends ModelName,
  O extends PostOperations | GetOperations,
> = Prisma.Args<Delegates[T], O>;

export type Results<
  T extends ModelName,
  A,
  O extends PostOperations | GetOperations,
> = Prisma.Result<Delegates[T], A, O>;

export type Exact<
  A extends Arguments<ModelName, PostOperations | GetOperations>,
  T extends ModelName,
  O extends PostOperations | GetOperations,
> = Prisma.Exact<A, Prisma.Args<Delegates[T], O>>;
