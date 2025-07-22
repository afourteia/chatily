import type { EnumerationObject, EnumType } from '@/shared-types';

export type activeStatusEnum = typeof activeStatusEnum;
export type ActiveStatusType = EnumType<
  activeStatusEnum['enumCategory'],
  activeStatusEnum['enumPrefix'],
  readonly (keyof activeStatusEnum['list'])[]
>;

export const activeStatusEnum = {
  enumCategory: 'ActiveStatus',
  enumPrefix: 'AS',
  list: {
    ACTIVE: {
      nameAr: 'مفعل',
      nameEn: 'Active',
    },
    INACTIVE: {
      nameAr: 'غير مفعل',
      nameEn: 'Inactive',
    },
    SUSPENDED: {
      nameAr: 'موقوف',
      nameEn: 'Suspended',
    },
    TEMP_SUSPENDED: {
      nameAr: 'موقوف مؤقتا',
      nameEn: 'Temporarily Suspended',
    },
    DELETED: {
      nameAr: 'محذوف',
      nameEn: 'Deleted',
    },
    BLOCKED: {
      nameAr: 'محظور',
      nameEn: 'Blocked',
    },
    PENDING: {
      nameAr: 'معلقة',
      nameEn: 'Pending',
    },
    BOT: {
      nameAr: 'بوت',
      nameEn: 'Bot',
    },
  } as const satisfies {
    [key: string]: EnumerationObject;
  },
} as const;

export const activeStatusEnumKeys: ActiveStatusType['keys'] = Object.keys(
  activeStatusEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof activeStatusEnum.list] =
    key as keyof typeof activeStatusEnum.list;
  return acc;
}, {} as Record<string, keyof typeof activeStatusEnum.list>) as {
  [K in keyof typeof activeStatusEnum.list]: K;
};

export const activeStatusEnumIds: ActiveStatusType['ids'] = Object.keys(
  activeStatusEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof activeStatusEnum.list] =
    `${activeStatusEnum.enumPrefix}_${key}` as `${ActiveStatusType['enumPrefix']}_${typeof key}`;
  return acc;
}, {} as Record<string, `${ActiveStatusType['enumPrefix']}_${string}`>) as {
  [K in keyof typeof activeStatusEnum.list]: `${ActiveStatusType['enumPrefix']}_${K}`;
};
