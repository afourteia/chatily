import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/app.ts'],
  outDir: 'dist',
  format: ['esm'], // or 'cjs' if you prefer
  sourcemap: true,
  bundle: true,
  // minify: true,
  clean: true,
  dts: false,
  splitting: false,
  noExternal: [
    '@project-name/enum',
    '@project-name/api',
    '@project-name/db',
  ],
  // external: [
  //   '.prisma/client', // If you import Prisma Client directly
  //   '@prisma/client', // If you use Prisma Client from node_modules
  //   'better-sqlite3', // If you use better-sqlite3 directly
  //   // '../../packages/mainDB/prisma/generated', // If you import generated client from here
  // ],
});
