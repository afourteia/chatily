import type { Prisma } from '@chatally/db/generated/prisma/client';

export type CountryObject = Omit<
  Prisma.CountryCreateInput,
  'id' | 'createdAt' | 'cities'
> & {
  cities: Record<
    string,
    Omit<Prisma.CityCreateInput, 'id' | 'createdAt' | 'country'>
  >;
};

// USE UN/LOCODE for cities along with ISO 3166-1 alpha-2 codes for countries
const country = {
  LY: {
    phoneCode: '+218',
    nameAr: 'ليبيا',
    nameEn: 'Libya',
    cities: {
      TIP: {
        nameAr: 'طرابلس',
        nameEn: 'Tripoli',
      },
      BEN: {
        nameAr: 'بنغازي',
        nameEn: 'Benghazi',
      },
      MIS: {
        nameAr: 'مصراتة',
        nameEn: 'Misrata',
      },
      ZUA: {
        nameAr: 'زوارة',
        nameEn: 'Zuara',
      },
    },
  },
  EG: {
    phoneCode: '+20',
    nameAr: 'مصر',
    nameEn: 'Egypt',
    cities: {
      CAI: {
        nameAr: 'القاهرة',
        nameEn: 'Cairo',
      },
      ALEX: {
        nameAr: 'الإسكندرية',
        nameEn: 'Alexandria',
      },
      GIZA: {
        nameAr: 'الجيزة',
        nameEn: 'Giza',
      },
      ASWAN: {
        nameAr: 'أسوان',
        nameEn: 'Aswan',
      },
    },
  },
  TN: {
    phoneCode: '+216',
    nameAr: 'تونس',
    nameEn: 'Tunisia',
    cities: {
      TUN: {
        nameAr: 'تونس',
        nameEn: 'Tunis',
      },
      SFAX: {
        nameAr: 'صفاقس',
        nameEn: 'Sfax',
      },
      SOUSSE: {
        nameAr: 'سوسة',
        nameEn: 'Sousse',
      },
      NABEUL: {
        nameAr: 'نابل',
        nameEn: 'Nabeul',
      },
    },
  },
  TR: {
    phoneCode: '+90',
    nameAr: 'تركيا',
    nameEn: 'Turkey',
    cities: {
      IST: {
        nameAr: 'إسطنبول',
        nameEn: 'Istanbul',
      },
      ANK: {
        nameAr: 'أنقرة',
        nameEn: 'Ankara',
      },
      IZM: {
        nameAr: 'إزمير',
        nameEn: 'Izmir',
      },
      ANT: {
        nameAr: 'أنطاليا',
        nameEn: 'Antalya',
      },
    },
  },
} as const satisfies Record<string, CountryObject>;
export default country;
