import '~/utils/env-config';
// import { config } from 'dotenv';
// import { dirname, join } from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// TODO: Fix relative path
// const envPath = join(__dirname, '../../../packages/dalilDb/');
// config({ path: join(envPath, '.env') });
// config({ path: join(__dirname, '../.env') });
// import { createRequire } from 'module';
// import type { PrismaClient as DalilPrismaClientType } from '@chatally/dalil-db/prisma/generated';
// const require = createRequire(import.meta.url);
// const {
//   PrismaClient: DalilPrismaClient,
// } = require('@chatally/dalil-db/prisma/generated');
// import type { PrismaClient as MainDbClientType } from '@chatally/db/prisma/generated';
// const { PrismaClient: MainDbClient } = require('@chatally/db/prisma/generated');
// import { PrismaClient as DalilPrismaClient } from '@chatally/dalil-db/prisma/generated';
import prisma from '~/utils/db';
import { generateSecret } from '~/utils/otp';
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

async function seedUser() {
  await prisma.user.upsert({
    where: {
      id: 'test-user-id',
    },
    create: {
      id: 'test-user-id',
      email: 'test@test.com',
      phone: '0910000000',
      name: returnFullName('مستخدم'),
      username: 'dalilUser',
      userSecret: {
        create: {
          passwordHash: await bcrypt.hash('dal@40!fert', 12),
          otpSecret: generateSecret(),
        },
      },
    },
    update: {
      email: 'test@test.com',
      phone: '0910000000',
      name: returnFullName('مستخدم'),
      username: 'dalilUser',
      userSecret: {
        upsert: {
          where: {
            userId: 'test-user-id',
          },
          update: {
            passwordHash: await bcrypt.hash('dal@40!fert', 12),
            otpSecret: generateSecret(),
          },
          create: {
            passwordHash: await bcrypt.hash('dal@40!fert', 12),
            otpSecret: generateSecret(),
          },
        },
      },
    },
  });

  await prisma.$disconnect();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedUser().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

function returnFullName(...names: (string | undefined)[]): string {
  return names.filter(Boolean).join(' ').trim() ?? 'غير معروف';
}
