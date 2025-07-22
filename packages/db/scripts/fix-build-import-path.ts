/* eslint-disable */
// @ts-nocheck
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Correctly resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetFileName = 'index.d.ts';
const targetFilePath = path.join(__dirname, '..', 'types', targetFileName);

const replacement = "import type { Prisma } from '../prisma/generated';";
// import type { Prisma } from '@prisma/generated';
// export { Prisma, type PrismaClient } from '@prisma/generated';

const content = readFileSync(targetFilePath, 'utf-8');
const newContent = content.replace(
  /^import type { Prisma } from '\.';/m,
  replacement,
);

writeFileSync(targetFilePath, newContent, 'utf-8');
console.log('Prisma import rewritten!');
