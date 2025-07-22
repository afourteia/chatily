import '~/utils/env-config';
import prisma from '~/utils/db';
import { enums } from '@chatally/enum';

export async function seedEnum() {
  console.log('Seeding enums...');

  const enumList = Object.keys(enums).flatMap((key) => {
    return enums[key as keyof typeof enums].enum;
  });

  for (const enumItem of enumList) {
    await prisma.enumeration.upsert({
      where: { id: enumItem.id },
      create: enumItem,
      update: enumItem,
    });
  }

  console.log('Enums seeded successfully.');

  console.log('checking for extra enums...');
  const existingEnums = await prisma.enumeration.findMany({
    select: { id: true, enumCategory: true, nameEn: true },
  });
  // const existingEnumIds = new Set(existingEnums.map((e) => e.id));
  const hardcodedEnumIds = enumList.map((e) => e.id);
  const extraEnums = existingEnums.filter(
    (e) => !hardcodedEnumIds.includes(e.id),
  );
  if (extraEnums.length > 0) {
    console.warn('Extra enums found that are not in the enum package:');
    extraEnums.forEach((e) =>
      console.warn(`- ${e.id} - (${e.enumCategory}: ${e.nameEn})`),
    );
  } else {
    console.log('No extra enums found.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedEnum().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
