// import { config } from 'dotenv';
// import { dirname, join } from 'path';
import ora from 'ora';
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
import superjson, { SuperJSON, type SuperJSONResult } from 'superjson';
import Decimal from 'decimal.js';
import type { CreateBeneficiaryInput } from '@project-name/api';
import type { Prisma } from '@project-name/db/generated/prisma/client';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import type { Meta } from './types';
superjson.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v),
  },
  'decimal.js',
);
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
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

const baseURL = 'http://localhost:3000';

async function createBeneficiaryListSnapshot() {
  const sourcePrisma = new DalilPrismaClient({
    // log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
  });
  // const mainPrisma = new MainDbClient({
  //   // log: ['query', 'info', 'warn', 'error'],
  //   errorFormat: 'pretty',
  // });
  // const beneficiaryEntities = await sourcePrisma.subscribers.findMany({
  //   where: {
  //     instituteId: 'db8d447a-c3ca-4d30-ab0a-b160c9cbd0eb',
  //   },
  // });
  // for (const entity of beneficiaryEntities) {
  // }

  const response = await fetch(`${baseURL}/crud/Beneficiary/updateMany`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-api-key': 'test-dalil-shafi-api-key-AA',
    },
    body: superjson.stringify({
      where: {},
      data: {
        isHidden: true,
      },
    } satisfies Prisma.BeneficiaryUpdateManyArgs),
  });
  if (!response.ok) {
    console.error('status:', response.status);
    console.log(
      '\n',
      await response.json().then((res) => JSON.stringify(res, null, 2)),
    );
    throw new Error(`Failed to hide all beneficiaries`);
  }
  console.log('all beneficiaries hidden!');

  const changeTrackingVersion =
    await sourcePrisma.$queryRaw`SELECT CHANGE_TRACKING_CURRENT_VERSION() AS CurrentVersion;`.then(
      (res) => {
        const arr = res as Array<{ CurrentVersion: BigInt }> | undefined;
        return arr && arr[0] ? arr[0].CurrentVersion : undefined;
      },
    );

  const metaFilePath = join(dirname(__filename), 'meta.json');
  let meta: Meta = {};

  if (existsSync(metaFilePath)) {
    try {
      meta = JSON.parse(readFileSync(metaFilePath, 'utf-8'));
    } catch (e) {
      console.error('Failed to parse existing meta.json:', e);
      meta = {
        changeTrackingVersion: null,
      };
    }
  }

  meta.changeTrackingVersion = changeTrackingVersion?.toString(); // Convert BigInt to string

  try {
    writeFileSync(metaFilePath, JSON.stringify(meta, null, 2), 'utf-8');
    console.log(
      'Change Tracking Version written to meta.json:',
      changeTrackingVersion,
    );
  } catch (e) {
    throw new Error(
      `Failed to write meta.json: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
  }

  console.log('change tracking version updated to the local file');

  const beneficiaries = await sourcePrisma.subscribers.findMany({
    where: {
      instituteId: 'db8d447a-c3ca-4d30-ab0a-b160c9cbd0eb',
    },
    include: {
      subscribers_info: true,
    },
  });
  const spinner = ora('Starting beneficiary creation...').start();
  for (const beneficiary of beneficiaries) {
    const response = await fetch(`${baseURL}/procedure/create-beneficiary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-api-key': 'test-dalil-shafi-api-key-AA',
      },
      body: superjson.stringify({
        id: beneficiary.subscriberId,
        contractId: beneficiary.instituteId,
        dalilId: beneficiary.DalilID,
        workId: beneficiary.workId,
        dalilDbId: BigInt(beneficiary.id),
        name: returnFullName(
          beneficiary.subscribers_info?.firstName,
          beneficiary.subscribers_info?.fatherName,
          beneficiary.subscribers_info?.familyName,
        ),
        dateOfBirth: beneficiary.subscribers_info?.birthday,
        relationship: beneficiary.relationshipID ?? 'غير معين',
        isActive:
          beneficiary.isActive > 0 && beneficiary.InsuranceStatus === true,
        isHidden: !beneficiary.InsuranceStatus,
      } satisfies CreateBeneficiaryInput),
    });
    if (!response.ok) {
      console.error('status:', response.status);
      console.log(
        '\n',
        await response.json().then((res) => JSON.stringify(res, null, 2)),
      );
      spinner.fail(
        `Failed to create beneficiary ${beneficiary.subscriberId}: ${response.statusText}`,
      );
      throw new Error(
        `Failed to create beneficiary ${beneficiary.subscriberId}: ${response.statusText}`,
      );
    }
    spinner.text = `${new Date().toISOString()} Created beneficiary: ${
      beneficiary.subscriberId
    }`;
  }
  spinner.succeed('All beneficiaries processed successfully.');
  await sourcePrisma.$disconnect();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createBeneficiaryListSnapshot().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

function returnFullName(...names: (string | undefined)[]): string {
  return names.filter(Boolean).join(' ').trim() ?? 'غير معروف';
}
