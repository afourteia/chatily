import type { EnumerationObject, EnumType } from '@/shared-types';

export type TransmissionStageEnumType = typeof transmissionStageEnum;
export type TransmissionStageType = EnumType<
  TransmissionStageEnumType['enumCategory'],
  TransmissionStageEnumType['enumPrefix'],
  readonly (keyof TransmissionStageEnumType['list'])[]
>;

export const transmissionStageEnum = {
  enumCategory: 'Transmission Stage',
  enumPrefix: 'TransStg',
  list: {
    SENT: {
      nameAr: 'تم الإرسال',
      nameEn: 'Sent',
    },
    DELIVERED: {
      nameAr: 'تم التسليم',
      nameEn: 'Delivered',
    },
    READ: {
      nameAr: 'تم القراءة',
      nameEn: 'Read',
    },
    FAILED: {
      nameAr: 'فشل',
      nameEn: 'Failed',
    },
    PENDING: {
      nameAr: 'معلقة',
      nameEn: 'Pending',
    },
    EXPIRED: {
      nameAr: 'منتهي الصلاحية',
      nameEn: 'Expired',
    },
    CANCELLED: {
      nameAr: 'ملغى',
      nameEn: 'Cancelled',
    },
  } as const satisfies {
    [key: string]: EnumerationObject;
  },
} as const;

export const transmissionStageEnumKeys: TransmissionStageType['keys'] =
  Object.keys(transmissionStageEnum.list).reduce((acc, key) => {
    acc[key as keyof typeof transmissionStageEnum.list] =
      key as keyof typeof transmissionStageEnum.list;
    return acc;
  }, {} as Record<string, keyof typeof transmissionStageEnum.list>) as {
    [K in keyof typeof transmissionStageEnum.list]: K;
  };

export const transmissionStageEnumIds: TransmissionStageType['ids'] =
  Object.keys(transmissionStageEnum.list).reduce((acc, key) => {
    acc[key as keyof typeof transmissionStageEnum.list] =
      `${transmissionStageEnum.enumPrefix}_${key}` as `${TransmissionStageType['enumPrefix']}_${typeof key}`;
    return acc;
  }, {} as Record<string, `${TransmissionStageType['enumPrefix']}_${string}`>) as {
    [K in keyof typeof transmissionStageEnum.list]: `${TransmissionStageType['enumPrefix']}_${K}`;
  };
