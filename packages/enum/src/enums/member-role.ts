import type { EnumerationObject, EnumType } from '@/shared-types';

export type memberRoleEnum = typeof memberRoleEnum;
export type MemberRoleType = EnumType<
  memberRoleEnum['enumCategory'],
  memberRoleEnum['enumPrefix'],
  readonly (keyof memberRoleEnum['list'])[]
>;

export const memberRoleEnum = {
  enumCategory: 'MemberRole',
  enumPrefix: 'tenantT',
  list: {
    OWNER: {
      nameAr: 'مالك',
      nameEn: 'Owner',
    },
    ADMIN: {
      nameAr: 'مدير',
      nameEn: 'Admin',
    },
    MEMBER: {
      nameAr: 'عضو',
      nameEn: 'Member',
    },
    MANAGER: {
      nameAr: 'مدير',
      nameEn: 'Manager',
    },
    AUDITOR: {
      nameAr: 'مدقق',
      nameEn: 'Auditor',
    },
  } as const satisfies {
    [key: string]: EnumerationObject;
  },
} as const;

export const memberRoleEnumKeys: MemberRoleType['keys'] = Object.keys(
  memberRoleEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof memberRoleEnum.list] =
    key as keyof typeof memberRoleEnum.list;
  return acc;
}, {} as Record<string, keyof typeof memberRoleEnum.list>) as {
  [K in keyof typeof memberRoleEnum.list]: K;
};

export const memberRoleEnumIds: MemberRoleType['ids'] = Object.keys(
  memberRoleEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof memberRoleEnum.list] =
    `${memberRoleEnum.enumPrefix}_${key}` as `${MemberRoleType['enumPrefix']}_${typeof key}`;
  return acc;
}, {} as Record<string, `${MemberRoleType['enumPrefix']}_${string}`>) as {
  [K in keyof typeof memberRoleEnum.list]: `${MemberRoleType['enumPrefix']}_${K}`;
};
