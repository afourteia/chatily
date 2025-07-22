import type { EnumerationObject, EnumType } from '@/shared-types';

export type CronJobStatusEnumType = typeof cronJobStatusEnum;
export type CronJobStatusType = EnumType<
  CronJobStatusEnumType['enumCategory'],
  CronJobStatusEnumType['enumPrefix'],
  readonly (keyof CronJobStatusEnumType['list'])[]
>;

export const cronJobStatusEnum = {
  enumCategory: 'CronJobStatus',
  enumPrefix: 'CRON_STATE',
  list: {
    NOMINAL: {
      nameAr: 'عادي',
      nameEn: 'Nominal',
    },
    STOPPED: {
      nameAr: 'متوقف',
      nameEn: 'Stopped',
    },
    DOWN: {
      nameAr: 'معطل',
      nameEn: 'Down',
    },
    RESET: {
      nameAr: 'إعادة تعيين',
      nameEn: 'Reset',
    },
    MAINTENANCE: {
      nameAr: 'صيانة',
      nameEn: 'Maintenance',
    },
    DEGRADED: {
      nameAr: 'متدهور',
      nameEn: 'Degraded',
    },
  } as const satisfies {
    [key: string]: EnumerationObject;
  },
} as const;

export const cronJobStatusEnumKeys: CronJobStatusType['keys'] = Object.keys(
  cronJobStatusEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof cronJobStatusEnum.list] =
    key as keyof typeof cronJobStatusEnum.list;
  return acc;
}, {} as Record<string, keyof typeof cronJobStatusEnum.list>) as {
  [K in keyof typeof cronJobStatusEnum.list]: K;
};

export const cronJobStatusEnumIds: CronJobStatusType['ids'] = Object.keys(
  cronJobStatusEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof cronJobStatusEnum.list] =
    `${cronJobStatusEnum.enumPrefix}_${key}` as `${CronJobStatusType['enumPrefix']}_${typeof key}`;
  return acc;
}, {} as Record<string, `${CronJobStatusType['enumPrefix']}_${string}`>) as {
  [K in keyof typeof cronJobStatusEnum.list]: `${CronJobStatusType['enumPrefix']}_${K}`;
};
