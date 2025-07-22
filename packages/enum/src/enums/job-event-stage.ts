import type { EnumerationObject, EnumType } from '@/shared-types';

export type JobEventStageEnumType = typeof jobEventStageEnum;
export type JobEventStageType = EnumType<
  JobEventStageEnumType['enumCategory'],
  JobEventStageEnumType['enumPrefix'],
  readonly (keyof JobEventStageEnumType['list'])[]
>;

export const jobEventStageEnum = {
  enumCategory: 'JobStage',
  enumPrefix: 'JOB_STAGE',
  list: {
    RUNNING: {
      nameAr: 'قيد التشغيل',
      nameEn: 'Running',
    },
    PENDING: {
      nameAr: 'معلقة',
      nameEn: 'Pending',
    },
    COMPLETED: {
      nameAr: 'مكتمل',
      nameEn: 'Completed',
    },
    FAILED: {
      nameAr: 'فشل',
      nameEn: 'Failed',
    },
    CANCELLED: {
      nameAr: 'ملغى',
      nameEn: 'Cancelled',
    },
  } as const satisfies {
    [key: string]: EnumerationObject;
  },
} as const;

export const jobEventStageEnumKeys: JobEventStageType['keys'] = Object.keys(
  jobEventStageEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof jobEventStageEnum.list] =
    key as keyof typeof jobEventStageEnum.list;
  return acc;
}, {} as Record<string, keyof typeof jobEventStageEnum.list>) as {
  [K in keyof typeof jobEventStageEnum.list]: K;
};

export const jobEventStageEnumIds: JobEventStageType['ids'] = Object.keys(
  jobEventStageEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof jobEventStageEnum.list] =
    `${jobEventStageEnum.enumPrefix}_${key}` as `${JobEventStageType['enumPrefix']}_${typeof key}`;
  return acc;
}, {} as Record<string, `${JobEventStageType['enumPrefix']}_${string}`>) as {
  [K in keyof typeof jobEventStageEnum.list]: `${JobEventStageType['enumPrefix']}_${K}`;
};
