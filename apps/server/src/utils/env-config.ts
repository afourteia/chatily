import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Polyfill __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`file directory: ${__dirname}`);
console.log(`nodejs working directory: ${process.cwd()}`);
let envFile = '.env.dev';
if (process.env.NODE_ENV === 'production') {
  envFile = '.env.prod';
}
dotenv.config({ path: path.resolve(process.cwd(), envFile) }); // Loads .env from the project root
console.log(`.env loaded from: ${path.resolve(process.cwd(), envFile)}`);
