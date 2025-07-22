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
  const sourcePrisma = new DalilPrismaClient({
    // log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
  });

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

  if (
    !meta.changeTrackingVersion ||
    typeof meta.changeTrackingVersion !== 'string'
  ) {
    throw new Error(
      `Invalid changeTrackingVersion in meta.json: ${meta.changeTrackingVersion}`,
    );
  }

  let changeTrackingVersionBgInt: BigInt;
  try {
    changeTrackingVersionBgInt = BigInt(meta.changeTrackingVersion);
  } catch (e) {
    throw new Error(
      `Failed to convert changeTrackingVersion to BigInt: ${meta.changeTrackingVersion}`,
    );
  }

  console.log(
    `Current change tracking version: ${changeTrackingVersionBgInt.toString()}`,
  );

  // sanity check of the subscriber tables in source db
  const subscribersWithoutInfo = await sourcePrisma.subscribers.findMany({
    where: {
      subscribers_info: {
        is: null,
      },
    },
  });
  const subscriberInfoWithoutSubscriber = await sourcePrisma.$queryRaw<
    Array<{ id: string; subscriberId: string | null }>
  >`
    SELECT *
    FROM huia.subscribers_info
    WHERE subscriberId IS NULL
  `;

  if (
    subscribersWithoutInfo.length > 0 ||
    subscriberInfoWithoutSubscriber.length > 0
  ) {
    throw new Error('subscribers without subscriberInfo row or viceVersa');
  } else {
    console.log('sanity check done');
  }

  // Shows the change tracking tables
  //   console.log(
  //     'Change Tracking Version:',
  //     await sourcePrisma.$queryRaw`SELECT
  //     t.name AS TableName,
  //     s.name AS SchemaName
  // FROM
  //     sys.change_tracking_tables ct
  //     INNER JOIN sys.tables t ON ct.object_id = t.object_id
  //     INNER JOIN sys.schemas s ON t.schema_id = s.schema_id;`,
  //     // .then((res) => {
  //     //   const arr = res as
  //     //     | Array<{ TableName: string; SchemaName: string }>
  //     //     | undefined;
  //     //   return arr && arr[0] ? arr[0].TableName : undefined;
  //     // }),
  //   );

  // const changes: changeDescription[] = await sourcePrisma.$queryRaw`
  // SELECT *
  // FROM CHANGETABLE(CHANGES huia.subscribers, ${24001320}) AS CT
  // ORDER BY SYS_CHANGE_VERSION`;
  const subscriberChanges: changeDescription[] = await sourcePrisma.$queryRaw`
  SELECT *, 'subscribers' as TableName, 'huia' as SchemaName
  FROM CHANGETABLE(CHANGES huia.subscribers, ${24001320}) AS CT
  ORDER BY SYS_CHANGE_VERSION`;

  const subscriberInfoChanges: changeDescription[] =
    await sourcePrisma.$queryRaw`
  SELECT *, 'subscribers_info' as TableName, 'huia' as SchemaName
  FROM CHANGETABLE(CHANGES huia.subscribers_info, ${24001320}) AS CT
  ORDER BY SYS_CHANGE_VERSION`;

  // Combine and sort by SYS_CHANGE_VERSION
  const allChanges = [...subscriberChanges, ...subscriberInfoChanges].sort(
    (a, b) => Number(a.SYS_CHANGE_VERSION) - Number(b.SYS_CHANGE_VERSION),
  );
  console.log(
    'Changes:',
    allChanges.filter((predicate) => predicate.SYS_CHANGE_OPERATION === 'D'),
  ); // Display first 10 changes for brevity
  //24983320

  const spinner = ora('Starting beneficiary sync...\n').start();
  for (const change of allChanges) {
    if (change.SYS_CHANGE_OPERATION === 'D') {
      // Handle deletion
      spinner.text = `Deleting beneficiary ${change.id}\n`;
      const where: Prisma.BeneficiaryFindFirstArgs['where'] = {
        dalilDbId: 11111111111,
      };
      const params = new URLSearchParams({
        q: superjson.stringify({ where }),
      }).toString();

      const beneficiaryLookup = await fetch(
        `http://192.168.88.49:3000/crud/Beneficiary/findFirst?${params}`,
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
        throw new Error(
          `Failed to delete beneficiary ${change.id}: ${beneficiaryLookup.statusText}`,
        );
      }
      const doesBeneficiaryExist: boolean = await beneficiaryLookup
        .json()
        .then((res) => !!res);
      console.log('Beneficiary exists:', doesBeneficiaryExist);

      // const response = await fetch(
      //   'http://localhost:3000/procedure/delete-beneficiary',
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Accept: 'application/json',
      //       'x-api-key': 'test-dalil-shafi-api-key-AA',
      //     },
      //     body: superjson.stringify({
      //       id: change.id.toString(),
      //       contractId: 'db8d447a-c3ca-4d30-ab0a-b160c9cbd0eb',
      //     }),
      //   },
      // );

      spinner.text = `Deleted beneficiary ${change.id}\n`;
    } else if (
      change.SYS_CHANGE_OPERATION === 'I' ||
      change.SYS_CHANGE_OPERATION === 'U'
    ) {
      // // Handle insertion or update
      // spinner.text = `Creating/updating beneficiary ${change.id}`;
      // const response = await fetch(
      //   'http://localhost:3000/procedure/create-beneficiary',
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Accept: 'application/json',
      //       'x-api-key': 'test-dalil-shafi-api-key-AA',
      //     },
      //     body: superjson.stringify({
      //       id: change.id.toString(),
      //       contractId: 'db8d447a-c3ca-4d30-ab0a-b160c9cbd0eb',
      //       dalilId: change.id.toString(), // Assuming DalilID is the same as id
      //       workId: change.id.toString(), // Assuming workId is the same as id
      //       name: returnFullName('غير معروف'), // Placeholder for name
      //       dateOfBirth: null, // Placeholder for dateOfBirth
      //       relationship: 'غير معين', // Placeholder for relationship
      //       isActive: true, // Placeholder for isActive
      //       isHidden: false, // Placeholder for isHidden
      //     } satisfies CreateBeneficiaryInput),
      //   },
      // );
      // if (!response.ok) {
      //   console.error('status:', response.status);
      //   console.log(
      //     await response.json().then((res) => JSON.stringify(res, null, 2)),
      //   );
      //   throw new Error(
      //     `Failed to create/update beneficiary ${change.id}: ${response.statusText}`,
      //   );
      // }
      // spinner.text = `Created/updated beneficiary ${change.id}`;
    }
  }
  spinner.succeed('Beneficiary sync completed successfully.\n');
  // const beneficiaries = await sourcePrisma.subscribers.findMany({
  //   where: {
  //     instituteId: 'db8d447a-c3ca-4d30-ab0a-b160c9cbd0eb',
  //   },
  //   include: {
  //     subscribers_info: true,
  //   },
  // });
  // for (const beneficiary of beneficiaries) {
  //   const response = await fetch(
  //     'http://localhost:3000/procedure/create-beneficiary',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //         'x-api-key': 'test-dalil-shafi-api-key-AA',
  //       },
  //       body: superjson.stringify({
  //         id: beneficiary.subscriberId,
  //         contractId: beneficiary.instituteId,
  //         dalilId: beneficiary.DalilID,
  //         workId: beneficiary.workId,
  //         name: returnFullName(
  //           beneficiary.subscribers_info?.firstName,
  //           beneficiary.subscribers_info?.fatherName,
  //           beneficiary.subscribers_info?.familyName,
  //         ),
  //         dateOfBirth: beneficiary.subscribers_info?.birthday,
  //         relationship: beneficiary.relationshipID ?? 'غير معين',
  //         isActive:
  //           beneficiary.isActive > 0 && beneficiary.InsuranceStatus === true,
  //         isHidden: !beneficiary.InsuranceStatus,
  //       } satisfies CreateBeneficiaryInput),
  //     },
  //   );
  //   if (!response.ok) {
  //     console.error('status:', response.status);
  //     console.log(
  //       await response
  //         .json()

  //         .then((res) => JSON.stringify(res, null, 2)),
  //     );
  //     throw new Error(
  //       `Failed to create beneficiary ${beneficiary.subscriberId}: ${response.statusText}`,
  //     );
  //   }
  //   console.log(`Created beneficiary ${beneficiary.subscriberId}`);
  // }
  // await sourcePrisma.$disconnect();
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
