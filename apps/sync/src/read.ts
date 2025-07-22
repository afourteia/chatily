// import { config } from 'dotenv';
// import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
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
import type { Meta } from './types';
import ora from 'ora';
import type { Prisma } from '@project-name/db/generated/prisma/client';
superjson.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v),
  },
  'decimal.js',
);

type changeDescription = {
  SYS_CHANGE_VERSION: BigInt;
  SYS_CHANGE_CREATION_VERSION: null | BigInt;
  SYS_CHANGE_OPERATION: 'U' | 'I' | 'D';
  SYS_CHANGE_COLUMNS: number[];
  SYS_CHANGE_CONTEXT: null;
  id: number;
};
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

async function syncBeneficiaryList() {
  {
    const query: Prisma.BeneficiaryFindFirstArgs = {
      where: {
        dalilDbId: 11111111111,
      },
      include: {
        entity: true,
      },
    };
    const params = new URLSearchParams({
      q: superjson.stringify(query),
    }).toString();

    const beneficiaryLookup = await fetch(
      `https://clinicgate.dalilshafi.com/api/crud/Beneficiary/findFirst?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-api-key': 'test-dalil-shafi-api-key-AA',
        },
      },
    );
    if (!beneficiaryLookup.ok) {
      console.error('status:', beneficiaryLookup.status);
      try {
        console.log(
          await beneficiaryLookup
            .json()
            .then((res) => JSON.stringify(res, null, 2)),
        );
      } catch (e) {
        console.error('Failed to parse response:', e);
      }
    }
    console.log(
      'Beneficiary:',
      await beneficiaryLookup.json().then((res) => res),
    );
  }
  {
    const query: Prisma.BeneficiaryFindFirstArgs = {
      where: {
        dalilDbId: 11111111111,
      },
      include: {
        entity: true,
      },
    };
    const params = new URLSearchParams({
      q: superjson.stringify(query),
    }).toString();

    const beneficiaryLookup = await fetch(
      `https://clinicgate.dalilshafi.com/api/crud/Beneficiary/findFirst?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-api-key': 'test-dalil-shafi-api-key-AA',
        },
      },
    );
    if (!beneficiaryLookup.ok) {
      console.error('status:', beneficiaryLookup.status);
      try {
        console.log(
          await beneficiaryLookup
            .json()
            .then((res) => JSON.stringify(res, null, 2)),
        );
      } catch (e) {
        console.error('Failed to parse response:', e);
      }
    }
    const doesBeneficiaryExist: boolean = await beneficiaryLookup
      .json()
      .then((res) => !!res);
    console.log('Beneficiary exists:', doesBeneficiaryExist);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncBeneficiaryList().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

function returnFullName(...names: (string | undefined)[]): string {
  return names.filter(Boolean).join(' ').trim() ?? 'غير معروف';
}
