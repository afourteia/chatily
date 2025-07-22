import { Prisma } from '../prisma/generated'; // Adjust the import path as needed
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Correctly resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TableNames = Object.values(Prisma.ModelName);
const routeTemplatePath = path.join(
  __dirname,
  '..',
  'templates',
  'routerFileTemplate.ts',
);
const routeTemplate = fs.readFileSync(routeTemplatePath, 'utf-8');
const routeOutputDir: string = path.resolve(__dirname, '..', 'src', 'routers');
const crudFolder = 'cruds';

console.info('removing files in output directory');
fs.rmSync(path.join(routeOutputDir, crudFolder), {
  recursive: true,
  force: true,
});
fs.mkdirSync(path.join(routeOutputDir, crudFolder), { recursive: true });

let fileCounter = 0;

TableNames.forEach((TableName) => {
  const tableName = TableName.charAt(0).toLowerCase() + TableName.slice(1);
  let output: string = '';
  output = routeTemplate
    .replace(/User/g, TableName)
    .replace(/user(?!Id)/g, tableName);
  fs.writeFileSync(
    path.join(routeOutputDir, crudFolder, `${tableName}.router.ts`),
    output,
  );
  fileCounter++;
});

console.info(`Generated ${fileCounter} router files`);
console.info('output is: ', path.join(routeOutputDir, crudFolder));

const routerTemplate = `import { Router } from 'express';

const crudRouter: Router = Router();`;

function generateRouters(template: string) {
  const routerFilePath = path.join(routeOutputDir, `${template}.router.ts`); // adjust the path as needed

  // let crudRouterFile = routerTemplate;
  let crudRouterFile = routerTemplate.replace(
    'templateRouter',
    `${template}Router`,
  );

  fileCounter = 0;
  let importStatements = '';
  let routerStatements = '';

  TableNames.forEach((TableName) => {
    const tableName = TableName.charAt(0).toLowerCase() + TableName.slice(1);
    // Generate import and router statements for each table
    const importStatement = `import ${tableName}Router from '@routers/${template}/${tableName}.router';\n`;
    const routerStatement = `crudRouter.use('/${tableName}', ${tableName}Router);\n`;

    // Add import and router statements to their respective strings
    importStatements += importStatement;
    routerStatements += routerStatement;
  });

  // Add import statements to the top of the template
  crudRouterFile = importStatements + crudRouterFile;

  // Add router statements to the router object
  crudRouterFile = crudRouterFile + '\n\n' + routerStatements;
  // `\n\nexport const ${template}Router = router({\n${routerStatements}\n});`;

  // Add default export
  crudRouterFile = crudRouterFile + '\nexport default crudRouter;\n';

  console.log(`Added ${fileCounter} imports and routers to _.router.ts`);
  fs.writeFileSync(routerFilePath, crudRouterFile);
}

generateRouters(crudFolder);
