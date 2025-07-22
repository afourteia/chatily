import type { EnumerationObject, EnumType } from '@/shared-types';

export type JobEventTypeEnumType = typeof jobEventTypeEnum;
export type JobEventTypeType = EnumType<
  JobEventTypeEnumType['enumCategory'],
  JobEventTypeEnumType['enumPrefix'],
  readonly (keyof JobEventTypeEnumType['list'])[]
>;

export const jobEventTypeEnum = {
  enumCategory: 'JobType',
  enumPrefix: 'JOB_TYPE',
  list: {
    UPTD_PROD_RECORD: {
      nameAr: 'تحديث سجل المنتج',
      nameEn: 'Update Product Record',
    },
  } as const satisfies {
    [key: string]: EnumerationObject;
  },
} as const;

export const jobEventTypeEnumKeys: JobEventTypeType['keys'] = Object.keys(
  jobEventTypeEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof jobEventTypeEnum.list] =
    key as keyof typeof jobEventTypeEnum.list;
  return acc;
}, {} as Record<string, keyof typeof jobEventTypeEnum.list>) as {
  [K in keyof typeof jobEventTypeEnum.list]: K;
};

export const jobEventTypeEnumIds: JobEventTypeType['ids'] = Object.keys(
  jobEventTypeEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof jobEventTypeEnum.list] =
    `${jobEventTypeEnum.enumPrefix}_${key}` as `${JobEventTypeType['enumPrefix']}_${typeof key}`;
  return acc;
}, {} as Record<string, `${JobEventTypeType['enumPrefix']}_${string}`>) as {
  [K in keyof typeof jobEventTypeEnum.list]: `${JobEventTypeType['enumPrefix']}_${K}`;
};
