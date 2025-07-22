import type { Prisma } from './generated/prisma/client.js';
export * from './meta.js';

export type ModelName = Prisma.ModelName;
export const modelNameObj = {
  User: 'user',
  UserSecret: 'userSecret',
  DeviceToken: 'deviceToken',
  RefreshToken: 'refreshToken',
  OneTimePassword: 'oneTimePassword',
  BeneficiaryEntity: 'beneficiaryEntity',
  Beneficiary: 'beneficiary',
  BeneficiaryStatusChangeLog: 'beneficiaryStatusChangeLog',
  ViewLog: 'viewLog',
  InvoiceInquiry: 'invoiceInquiry',
  EventLog: 'eventLog',
  Notification: 'notification',
  AggregateSnapshot: 'aggregateSnapshot',
  EventStore: 'eventStore',
  EventCommand: 'eventCommand',
  Tenant: 'tenant',
  TenantMember: 'tenantMember',
  TenantAccessPolicy: 'tenantAccessPolicy',
  Resource: 'resource',
  Country: 'country',
  City: 'city',
  Enumeration: 'enumeration',
  Tag: 'tag',
  SchemaTables: 'schemaTables',
} as const;
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

export type Delegates = {
  User: Prisma.UserDelegate;
  UserSecret: Prisma.UserSecretDelegate;
  DeviceToken: Prisma.DeviceTokenDelegate;
  RefreshToken: Prisma.RefreshTokenDelegate;
  OneTimePassword: Prisma.OneTimePasswordDelegate;
  BeneficiaryEntity: Prisma.BeneficiaryEntityDelegate;
  Beneficiary: Prisma.BeneficiaryDelegate;
  BeneficiaryStatusChangeLog: Prisma.BeneficiaryStatusChangeLogDelegate;
  ViewLog: Prisma.ViewLogDelegate;
  InvoiceInquiry: Prisma.InvoiceInquiryDelegate;
  EventLog: Prisma.EventLogDelegate;
  Notification: Prisma.NotificationDelegate;
  AggregateSnapshot: Prisma.AggregateSnapshotDelegate;
  EventStore: Prisma.EventStoreDelegate;
  EventCommand: Prisma.EventCommandDelegate;
  Tenant: Prisma.TenantDelegate;
  TenantMember: Prisma.TenantMemberDelegate;
  TenantAccessPolicy: Prisma.TenantAccessPolicyDelegate;
  Resource: Prisma.ResourceDelegate;
  Country: Prisma.CountryDelegate;
  City: Prisma.CityDelegate;
  Enumeration: Prisma.EnumerationDelegate;
  Tag: Prisma.TagDelegate;
  SchemaTables: Prisma.SchemaTablesDelegate;
};

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
