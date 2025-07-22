import {
  Prisma,
  PrismaClient,
} from '@chatally/db/generated/prisma/client';

// import { createRequire } from 'module';

// const require = createRequire(import.meta.url);
// const { PrismaClient } = require('@chatally/db/generated/prisma/client');
// Hard-code a unique key, so we can look up the client when this module gets re-imported
const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
  transactionOptions: {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    maxWait: 5000, // default: 2000
    timeout: 10000, // default: 5000
  },
}).$extends({});

export type PrismaInstance = typeof prisma;

export default prisma;
