import { Prisma } from '@prisma/main/prisma/generated';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Correctly resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TableNames = Object.values(Prisma.ModelName);
const templatePath = path.join(
  __dirname,
  '..',
  'templates',
  'serviceFileTemplate.ts',
);
const template = fs.readFileSync(templatePath, 'utf-8');
const outputDirectory: string = path.resolve(
  __dirname,
  '..',
  'src',
  'services',
);

console.info('removing files in output directory');
fs.rmSync(outputDirectory, { recursive: true, force: true });
// Recreate the directories
fs.mkdirSync(outputDirectory, { recursive: true });

TableNames.forEach((TableName) => {
  const tableName = TableName.charAt(0).toLowerCase() + TableName.slice(1);
  const output: string = template
    .replace(/User/g, TableName)
    .replace(/user(?!Id)/g, tableName);

  fs.writeFileSync(
    path.join(outputDirectory, `${tableName}.service.ts`),
    output,
  );
});

console.log('output is: ', outputDirectory);
