import type { EnumerationObject, EnumType } from '@/shared-types';

export type LogLevelEnumType = typeof logLevelEnum;
export type LogLevelType = EnumType<
  LogLevelEnumType['enumCategory'],
  LogLevelEnumType['enumPrefix'],
  readonly (keyof LogLevelEnumType['list'])[]
>;

export const logLevelEnum = {
  enumCategory: 'LogLevel',
  enumPrefix: 'LOG_LEVEL',
  list: {
    INFO: {
      nameAr: 'معلومة',
      nameEn: 'Info',
    },
    WARN: {
      nameAr: 'تحذير',
      nameEn: 'Warning',
    },
    ERROR: {
      nameAr: 'خطأ',
      nameEn: 'Error',
    },
    FATAL: {
      nameAr: 'مدمّـر',
      nameEn: 'Fatal',
    },
  } as const satisfies {
    [key: string]: EnumerationObject;
  },
} as const;

export const logLevelEnumKeys: LogLevelType['keys'] = Object.keys(
  logLevelEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof logLevelEnum.list] =
    key as keyof typeof logLevelEnum.list;
  return acc;
}, {} as Record<string, keyof typeof logLevelEnum.list>) as {
  [K in keyof typeof logLevelEnum.list]: K;
};

export const logLevelEnumIds: LogLevelType['ids'] = Object.keys(
  logLevelEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof logLevelEnum.list] =
    `${logLevelEnum.enumPrefix}_${key}` as `${LogLevelType['enumPrefix']}_${typeof key}`;
  return acc;
}, {} as Record<string, `${LogLevelType['enumPrefix']}_${string}`>) as {
  [K in keyof typeof logLevelEnum.list]: `${LogLevelType['enumPrefix']}_${K}`;
};
