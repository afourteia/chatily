import { readFileSync, writeFileSync } from 'fs';

const filePath = './types/index.d.ts'; // adjust as needed
const replacement = "import type { Prisma } from '../prisma/generated';";
// import type { Prisma } from '@prisma/generated';
// export { Prisma, type PrismaClient } from '@prisma/generated';

const content = readFileSync(filePath, 'utf-8');
const newContent = content.replace(
  /^import type { Prisma } from '\.';/m,
  replacement,
);

writeFileSync(filePath, newContent, 'utf-8');
console.log('Prisma import rewritten!');
