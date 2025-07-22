import type { EnumerationObject, EnumType } from '@/shared-types';

export type resourceTypeEnum = typeof resourceTypeEnum;
export type ResourceTypeType = EnumType<
  resourceTypeEnum['enumCategory'],
  resourceTypeEnum['enumPrefix'],
  readonly (keyof resourceTypeEnum['list'])[]
>;

export const resourceTypeEnum = {
  enumCategory: 'ResourceType',
  enumPrefix: 'tenantT',
  list: {
    HEALTHCARE_CENTER: {
      nameAr: 'مركز الرعاية الصحية',
      nameEn: 'Healthcare Center',
    },
    INSURANCE_POLICY: {
      nameAr: 'وثيقة تأمين',
      nameEn: 'Insurance Policy',
    },
  } as const satisfies {
    [key: string]: EnumerationObject;
  },
} as const;

export const resourceTypeEnumKeys: ResourceTypeType['keys'] = Object.keys(
  resourceTypeEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof resourceTypeEnum.list] =
    key as keyof typeof resourceTypeEnum.list;
  return acc;
}, {} as Record<string, keyof typeof resourceTypeEnum.list>) as {
  [K in keyof typeof resourceTypeEnum.list]: K;
};

export const resourceTypeEnumIds: ResourceTypeType['ids'] = Object.keys(
  resourceTypeEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof resourceTypeEnum.list] =
    `${resourceTypeEnum.enumPrefix}_${key}` as `${ResourceTypeType['enumPrefix']}_${typeof key}`;
  return acc;
}, {} as Record<string, `${ResourceTypeType['enumPrefix']}_${string}`>) as {
  [K in keyof typeof resourceTypeEnum.list]: `${ResourceTypeType['enumPrefix']}_${K}`;
};
