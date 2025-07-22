import type { EnumerationObject, EnumType } from '@/shared-types';

export type ReviewStatusEnumType = typeof reviewStatusEnum;
export type ReviewStatusType = EnumType<
  ReviewStatusEnumType['enumCategory'],
  ReviewStatusEnumType['enumPrefix'],
  readonly (keyof ReviewStatusEnumType['list'])[]
>;

export const reviewStatusEnum = {
  enumCategory: 'Review Status',
  enumPrefix: 'RvwSt',
  list: {
    PENDING: {
      nameAr: 'معلقة',
      nameEn: 'Pending',
    },
    // SUBMITTED: {
    //   nameAr: 'تم التقديم',
    //   nameEn: 'Submitted',
    // },
    REVIEW_READY: {
      nameAr: 'جاهز للمراجعة',
      nameEn: 'Review Ready',
    },
    APPROVED: {
      nameAr: 'موافق',
      nameEn: 'Approved',
    },
    DENIED: {
      nameAr: 'مرفوض',
      nameEn: 'Denied',
    },
    CANCELLED: {
      nameAr: 'ملغى',
      nameEn: 'Cancelled',
    },
  } as const satisfies {
    [key: string]: EnumerationObject;
  },
} as const;

export const reviewStatusEnumKeys: ReviewStatusType['keys'] = Object.keys(
  reviewStatusEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof reviewStatusEnum.list] =
    key as keyof typeof reviewStatusEnum.list;
  return acc;
}, {} as Record<string, keyof typeof reviewStatusEnum.list>) as {
  [K in keyof typeof reviewStatusEnum.list]: K;
};

export const reviewStatusEnumIds: ReviewStatusType['ids'] = Object.keys(
  reviewStatusEnum.list,
).reduce((acc, key) => {
  acc[key as keyof typeof reviewStatusEnum.list] =
    `${reviewStatusEnum.enumPrefix}_${key}` as `${ReviewStatusType['enumPrefix']}_${typeof key}`;
  return acc;
}, {} as Record<string, `${ReviewStatusType['enumPrefix']}_${string}`>) as {
  [K in keyof typeof reviewStatusEnum.list]: `${ReviewStatusType['enumPrefix']}_${K}`;
};
