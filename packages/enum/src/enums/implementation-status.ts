import type { EnumerationObject, EnumType } from '@/shared-types';

export type ImplementationStatusEnumType = typeof implementationStatusEnum;
export type ImplementationStatusType = EnumType<
  ImplementationStatusEnumType['enumCategory'],
  ImplementationStatusEnumType['enumPrefix'],
  readonly (keyof ImplementationStatusEnumType['list'])[]
>;

export const implementationStatusEnum = {
  enumCategory: 'Implementation Status',
  enumPrefix: 'ImpSte',
  list: {
    SCHEDULED: {
      nameAr: 'مجدول',
      nameEn: 'Scheduled',
    },
    IMPLEMENTING: {
      nameAr: 'قيد التنفيذ',
      nameEn: 'Implementing',
    },
    IMPLEMENTED: {
      nameAr: 'منفذ',
      nameEn: 'Implemented',
    },
    CANCELLED: {
      nameAr: 'ملغي',
      nameEn: 'Cancelled',
    },
    ERROR: {
      nameAr: 'خطأ',
      nameEn: 'Error',
    },
  } as const satisfies {
    [key: string]: EnumerationObject;
  },
} as const;

export const implementationStatusEnumKeys: ImplementationStatusType['keys'] =
  Object.keys(implementationStatusEnum.list).reduce((acc, key) => {
    acc[key as keyof typeof implementationStatusEnum.list] =
      key as keyof typeof implementationStatusEnum.list;
    return acc;
  }, {} as Record<string, keyof typeof implementationStatusEnum.list>) as {
    [K in keyof typeof implementationStatusEnum.list]: K;
  };

export const implementationStatusEnumIds: ImplementationStatusType['ids'] =
  Object.keys(implementationStatusEnum.list).reduce((acc, key) => {
    acc[key as keyof typeof implementationStatusEnum.list] =
      `${implementationStatusEnum.enumPrefix}_${key}` as `${ImplementationStatusType['enumPrefix']}_${typeof key}`;
    return acc;
  }, {} as Record<string, `${ImplementationStatusType['enumPrefix']}_${string}`>) as {
    [K in keyof typeof implementationStatusEnum.list]: `${ImplementationStatusType['enumPrefix']}_${K}`;
  };
