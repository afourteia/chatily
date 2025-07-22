import '~/utils/env-config';
// import { config } from 'dotenv';
// import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
//TODO: Fix relative path
// const envPath = join(__dirname, '../../../packages/dalilDb/');
// config({ path: join(envPath, '.env') });
// config({ path: join(__dirname, '../.env') });
// import { createRequire } from 'module';
// import type { PrismaClient as DalilPrismaClientType } from '@project-name/dalil-db/prisma/generated';
// const require = createRequire(import.meta.url);
// const {
//   PrismaClient: DalilPrismaClient,
// } = require('@project-name/dalil-db/prisma/generated');
// import type { PrismaClient as MainDbClientType } from '@project-name/db/prisma/generated';
// const { PrismaClient: MainDbClient } = require('@project-name/db/prisma/generated');
import { PrismaClient as DalilPrismaClient } from '@project-name/dalil-db/prisma/generated';
import prisma from '~/utils/db';
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// const settings = {
//   NODE_ENV: process.env.NODE_ENV ?? 'UNDEFINED',
//   PORT: process.env.PORT ?? 3000,
//   HOST: process.env.HOST ?? 'http://localhost',
//   ORIGIN_URL: process.env.ORIGIN_URL ?? 'http://localhost:5173',
//   ORIGIN_REMOTE: process.env.ORIGIN_REMOTE ?? 'http://192.168.88.49:5173',
//   ENABLE_CRON: process.env.ENABLE_CRON === 'true',
//   DALIL_DB_URL: process.env.DALILSHAFI_DATABASE_URL,
//   MAIN_DB: process.env.MAIN_DATABASE_URL,
// };
// console.log(JSON.stringify(settings, null, 2));

async function populateEntities() {
  const sourcePrisma = new DalilPrismaClient({
    // log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
  });
  // const mainPrisma = new MainDbClient({
  //   // log: ['query', 'info', 'warn', 'error'],
  //   errorFormat: 'pretty',
  // });
  const beneficiaryEntities = await sourcePrisma.subscribers.findMany({
    where: {
      instituteId: 'db8d447a-c3ca-4d30-ab0a-b160c9cbd0eb',
    },
  });
  for (const entity of beneficiaryEntities) {
    await prisma.beneficiaryEntity.upsert({
      where: {
        institution_workId: {
          institution: entity.instituteId,
          workId: entity.workId,
        },
      },
      create: {
        institution: entity.instituteId,
        workId: entity.workId,
      },
      update: {
        institution: entity.instituteId,
        workId: entity.workId,
      },
    });
  }

  const beneficiaries = await sourcePrisma.subscribers.findMany({
    where: {
      instituteId: 'db8d447a-c3ca-4d30-ab0a-b160c9cbd0eb',
    },
    include: {
      subscribers_info: true,
    },
  });
  for (const beneficiary of beneficiaries) {
    await prisma.beneficiary.upsert({
      where: {
        id: beneficiary.subscriberId,
      },
      create: {
        id: beneficiary.subscriberId,
        name: returnFullName(
          beneficiary!.subscribers_info?.firstName,
          beneficiary!.subscribers_info?.fatherName,
          beneficiary!.subscribers_info?.familyName,
        ),
        dalilId: beneficiary.DalilID,
        relationship: beneficiary.relationshipID ?? 'غير معين',
        workId: beneficiary.workId,
        entity: {
          connect: {
            institution_workId: {
              institution: beneficiary.instituteId,
              workId: beneficiary.workId,
            },
          },
        },
        dateOfBirth: beneficiary.subscribers_info?.birthday,
        isActive:
          beneficiary.isActive > 0 && beneficiary.InsuranceStatus === true,
        isHidden: !beneficiary.InsuranceStatus,
      },
      update: {
        name: returnFullName(
          beneficiary!.subscribers_info?.firstName,
          beneficiary!.subscribers_info?.fatherName,
          beneficiary!.subscribers_info?.familyName,
        ),
        dalilId: beneficiary.DalilID,
        relationship: beneficiary.relationshipID ?? 'غير معين',
        workId: beneficiary.workId,
        entity: {
          connect: {
            institution_workId: {
              institution: beneficiary.instituteId,
              workId: beneficiary.workId,
            },
          },
        },
        isActive:
          beneficiary.isActive > 0 && beneficiary.InsuranceStatus === true,
        isHidden: !beneficiary.InsuranceStatus,
      },
    });
  }

  await prisma.$disconnect();
  await sourcePrisma.$disconnect();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  populateEntities().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

function returnFullName(...names: (string | undefined)[]): string {
  return names.filter(Boolean).join(' ').trim() ?? 'غير معروف';
}
