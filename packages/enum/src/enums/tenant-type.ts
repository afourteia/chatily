import type { EnumerationObject, EnumType } from '@/shared-types';

export type tenantTypeEnum = typeof tenantTypeEnum;
export type TenantTypeType = EnumType<
  tenantTypeEnum['enumCategory'],
  tenantTypeEnum['enumPrefix'],
  readonly (keyof tenantTypeEnum['list'])[]
>;

export const tenantTypeEnum = {
  enumCategory: 'TenantType',
  enumPrefix: 'tenantT',
  list: {
    HEALTHCARE_PROVIDER: {
      nameAr: 'مقدم الرعاية الصحية',
      nameEn: 'Healthcare Provider',
    },
    INSURANCE_AUDITOR: {
      nameAr: 'مدقق التأمين',
      nameEn: 'Insurance Auditor',
    },
    INSTITUTION: {
      nameAr: 'مؤسسة',
      nameEn: 'Institution',
    },
  } as const satisfies {
    [key: string]: EnumerationObject;
  },
} as const;

export const tenantTypeEnumKeys: TenantTypeType['keys'] = Object.keys(
  tenantTypeEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof tenantTypeEnum.list] =
    key as keyof typeof tenantTypeEnum.list;
  return acc;
}, {} as Record<string, keyof typeof tenantTypeEnum.list>) as {
  [K in keyof typeof tenantTypeEnum.list]: K;
};

export const tenantTypeEnumIds: TenantTypeType['ids'] = Object.keys(
  tenantTypeEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof tenantTypeEnum.list] =
    `${tenantTypeEnum.enumPrefix}_${key}` as `${TenantTypeType['enumPrefix']}_${typeof key}`;
  return acc;
}, {} as Record<string, `${TenantTypeType['enumPrefix']}_${string}`>) as {
  [K in keyof typeof tenantTypeEnum.list]: `${TenantTypeType['enumPrefix']}_${K}`;
};
