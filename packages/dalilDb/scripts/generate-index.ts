import { Prisma } from '../prisma/generated'; // Adjust the import path as needed
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Correctly resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetFileName = 'index.ts';
const TableNames = Object.values(Prisma.ModelName);
const typeTemplatePath = path.join(
  __dirname,
  '..',
  'templates',
  'index.template.ts',
);
const typeTemplate = fs.readFileSync(typeTemplatePath, 'utf-8');
const typeOutputDir: string = path.resolve(__dirname, '..');
console.info(`creating the directory if doesn't exist`);
fs.mkdirSync(typeOutputDir, { recursive: true });
const filePath: string = path.join(typeOutputDir, targetFileName);
console.info(`Removing the file if it exists`);
if (fs.existsSync(filePath)) {
  fs.unlinkSync(filePath);
  console.info(`File ${filePath} removed successfully`);
} else {
  console.info(`File ${filePath} does not exist`);
}

const delegateTemplate = '  User: Prisma.UserDelegate;\n';
let delegateList: string = '';
let modelNameList: string = '';

TableNames.forEach((TableName) => {
  // const tableName = TableName.charAt(0).toLowerCase() + TableName.slice(1);
  // Generate import and router statements for each table
  delegateList += delegateTemplate.replace(/User/g, TableName);
  modelNameList += `  ${TableName}: "${uncapitalize(TableName)}",\n`;
});

const outputFile = typeTemplate
  .replace('Delegates = {};', `Delegates = {\n${delegateList}};`)
  .replace(
    'modelNameObj = {} as const;',
    `modelNameObj = {\n${modelNameList}} as const;`,
  )
  .replace(
    '/* eslint-disable @typescript-eslint/no-empty-object-type */\n/* eslint-disable @typescript-eslint/ban-ts-comment */\n// @ts-nocheck\n',
    '',
  );

fs.writeFileSync(path.join(typeOutputDir, targetFileName), outputFile);
console.info(`${targetFileName} file generated at ${typeOutputDir}`);

function uncapitalize(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
