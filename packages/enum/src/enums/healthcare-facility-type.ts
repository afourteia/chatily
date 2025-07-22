import type { EnumerationObject, EnumType } from '@/shared-types';

export type HealthcareFacilityTypeEnumType = typeof healthcareFacilityTypeEnum;
export type HealthcareFacilityTypeType = EnumType<
  HealthcareFacilityTypeEnumType['enumCategory'],
  HealthcareFacilityTypeEnumType['enumPrefix'],
  readonly (keyof HealthcareFacilityTypeEnumType['list'])[]
>;

export const healthcareFacilityTypeEnum = {
  enumCategory: 'HealthcareFacilityType',
  enumPrefix: 'HC',
  list: {
    CLINIC: {
      nameAr: 'عيادة',
      nameEn: 'Clinic',
    },
    HOSPITAL: {
      nameAr: 'مستشفى',
      nameEn: 'Hospital',
    },
    LAB: {
      nameAr: 'مختبر',
      nameEn: 'Lab',
    },
    PHARMACY: {
      nameAr: 'صيدلية',
      nameEn: 'Pharmacy',
    },
    OUT_OF_NETWORK: {
      nameAr: 'خارج الشبكة',
      nameEn: 'Out of Network',
    },
  } as const satisfies {
    [key: string]: EnumerationObject;
  },
} as const;

export const healthcareFacilityTypeEnumKeys: HealthcareFacilityTypeType['keys'] =
  Object.keys(healthcareFacilityTypeEnum.list).reduce((acc, key) => {
    acc[key as keyof typeof healthcareFacilityTypeEnum.list] =
      key as keyof typeof healthcareFacilityTypeEnum.list;
    return acc;
  }, {} as Record<string, keyof typeof healthcareFacilityTypeEnum.list>) as {
    [K in keyof typeof healthcareFacilityTypeEnum.list]: K;
  };

export const healthcareFacilityTypeEnumIds: HealthcareFacilityTypeType['ids'] =
  Object.keys(healthcareFacilityTypeEnum.list).reduce((acc, key) => {
    acc[key as keyof typeof healthcareFacilityTypeEnum.list] =
      `${healthcareFacilityTypeEnum.enumPrefix}_${key}` as `${HealthcareFacilityTypeType['enumPrefix']}_${typeof key}`;
    return acc;
  }, {} as Record<string, `${HealthcareFacilityTypeType['enumPrefix']}_${string}`>) as {
    [K in keyof typeof healthcareFacilityTypeEnum.list]: `${HealthcareFacilityTypeType['enumPrefix']}_${K}`;
  };
