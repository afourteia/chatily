import type { EnumerationObject, EnumType } from '@/shared-types';

export type GenderEnumType = typeof genderEnum;
export type GenderType = EnumType<
  GenderEnumType['enumCategory'],
  GenderEnumType['enumPrefix'],
  readonly (keyof GenderEnumType['list'])[]
>;

export const genderEnum = {
  enumCategory: 'Gender',
  enumPrefix: 'Gnd',
  list: {
    MALE: {
      nameAr: 'ذكر',
      nameEn: 'male',
    },
    FEMALE: {
      nameAr: 'أنثى',
      nameEn: 'female',
    },
    UNKNOWN: {
      nameAr: 'غير معروف',
      nameEn: 'unknown',
    },
  } as const satisfies {
    [key: string]: EnumerationObject;
  },
} as const;

export const genderEnumKeys: GenderType['keys'] = Object.keys(
  genderEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof genderEnum.list] =
    key as keyof typeof genderEnum.list;
  return acc;
}, {} as Record<string, keyof typeof genderEnum.list>) as {
  [K in keyof typeof genderEnum.list]: K;
};

export const genderEnumIds: GenderType['ids'] = Object.keys(
  genderEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof genderEnum.list] =
    `${genderEnum.enumPrefix}_${key}` as `${GenderType['enumPrefix']}_${typeof key}`;
  return acc;
}, {} as Record<string, `${GenderType['enumPrefix']}_${string}`>) as {
  [K in keyof typeof genderEnum.list]: `${GenderType['enumPrefix']}_${K}`;
};
