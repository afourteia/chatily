import type { Prisma } from '@chatally/db/generated/prisma/client';

export type EnumerationObject = Omit<
  Prisma.EnumerationCreateManyInput,
  'id' | 'enumCategory'
>;

export type EnumType<
  Cat extends string,
  Pre extends string,
  keys extends readonly string[],
> = {
  enumCategory: Cat;
  enumPrefix: Pre;
  keys: {
    [K in keys[number]]: K;
  };
  ids: { [K in keys[number]]: `${Pre}_${K}` };
  list: [
    {
      id: `${Pre}_${Extract<keys, string>}`;
      enumCategory: Cat;
      nameAr: string;
      nameEn: string;
    },
  ];
};
