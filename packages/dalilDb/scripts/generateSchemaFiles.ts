import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

// Correctly resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDir = path.resolve(__dirname, '..', 'schema', 'zod');
const targetDir = path.resolve(__dirname, '..', 'src', 'schemas');
const sourceEnumsDir: string = path.resolve(sourceDir, 'enums');
const targetEnumsDir: string = path.resolve(targetDir, 'enums');
const sourceObjectDir: string = path.resolve(sourceDir, 'objects');
const targetObjectDir: string = path.resolve(targetDir, 'objects');

console.info('source are:\n', sourceEnumsDir, '\n', sourceObjectDir);
console.info('output are:\n', targetEnumsDir, '\n', targetObjectDir);

console.info('removing files in output directory');
fs.rmSync(targetEnumsDir, { recursive: true, force: true });
fs.rmSync(targetObjectDir, { recursive: true, force: true });

// Recreate the directories
fs.mkdirSync(targetEnumsDir, { recursive: true });
fs.mkdirSync(targetObjectDir, { recursive: true });

function copyFiles(sourceDirectory: string, destinationDirectory: string) {
  console.log(
    chalk.blue('copying object schema files from: '),
    sourceDirectory,
    chalk.blue('to: '),
    destinationDirectory,
  );
  let fileCounter = 0;
  fs.readdir(sourceDirectory, async (err, files) => {
    if (err) {
      if (err.errno === -2 || err.errno === -4058) {
        console.error(
          chalk.red('Could not list the directory:', sourceDirectory),
        );

        return;
      }
      throw err;
    }

    // Map each file to a promise that resolves when the file is copied
    const copyPromises = files.map((file) => {
      return new Promise<void>((resolve, reject) => {
        const sourceFilePath = path.join(sourceDirectory, file);
        const destinationFilePath = path.join(destinationDirectory, file);

        fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
          if (err) {
            console.error(`File ${file} could not be copied.`, err);
            reject(err);
          } else {
            fileCounter++;
            resolve();
          }
        });
      });
    });

    // Wait for all the files to finish copying
    await Promise.all(copyPromises)
      .then(() => {
        console.info(`copied ${fileCounter} files`);
      })
      .catch((err) => {
        console.error('An error occurred while copying the files.', err);
      });
  });
}

copyFiles(sourceEnumsDir, targetEnumsDir);
copyFiles(sourceObjectDir, targetObjectDir);
