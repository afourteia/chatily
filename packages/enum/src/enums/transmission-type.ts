import type { EnumerationObject, EnumType } from '@/shared-types';

export type TransmissionTypeEnumType = typeof transmissionTypeEnum;
export type TransmissionTypeType = EnumType<
  TransmissionTypeEnumType['enumCategory'],
  TransmissionTypeEnumType['enumPrefix'],
  readonly (keyof TransmissionTypeEnumType['list'])[]
>;

export const transmissionTypeEnum = {
  enumCategory: 'Message Purpose',
  enumPrefix: 'MSG_TYPE',
  list: {
    OTP: {
      nameAr: 'رمز التحقق',
      nameEn: 'OTP',
    },
    TRANSACTION: {
      nameAr: 'معاملة',
      nameEn: 'Transaction',
    },
    PROMOTION: {
      nameAr: 'ترويج',
      nameEn: 'Promotion',
    },
    TRANSMISSION: {
      nameAr: 'إشعار',
      nameEn: 'Transmission',
    },
    WARNING: {
      nameAr: 'تحذير',
      nameEn: 'Warning',
    },
    PAYLOAD_ONLY: {
      nameAr: 'حمولة فقط',
      nameEn: 'Payload Only',
    },
  } as const satisfies {
    [key: string]: EnumerationObject;
  },
} as const;

export const transmissionTypeEnumKeys: TransmissionTypeType['keys'] =
  Object.keys(transmissionTypeEnum.list).reduce((acc, key) => {
    acc[key as keyof typeof transmissionTypeEnum.list] =
      key as keyof typeof transmissionTypeEnum.list;
    return acc;
  }, {} as Record<string, keyof typeof transmissionTypeEnum.list>) as {
    [K in keyof typeof transmissionTypeEnum.list]: K;
  };

export const transmissionTypeEnumIds: TransmissionTypeType['ids'] = Object.keys(
  transmissionTypeEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof transmissionTypeEnum.list] =
    `${transmissionTypeEnum.enumPrefix}_${key}` as `${TransmissionTypeType['enumPrefix']}_${typeof key}`;
  return acc;
}, {} as Record<string, `${TransmissionTypeType['enumPrefix']}_${string}`>) as {
  [K in keyof typeof transmissionTypeEnum.list]: `${TransmissionTypeType['enumPrefix']}_${K}`;
};
