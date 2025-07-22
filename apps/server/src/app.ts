import '~/utils/env-config'; // Load environment variables from .env file
// import InitiateCronJobs from '~/cron';
// import cors from 'cors';
import crudRouter from '~/routers/cruds.router';
import procedureRouter from '~/routers/procedures.router';
// import seedRouter from '~/routers/seed.router';
// import transactionRouter from '~/routers/transaction.router';

import express from 'express';
import { expressErrorHandler } from '~/utils/error';
// import path from 'path';

// Build the path to the appropriate .env file
// const envPath = path.resolve(
//   process.cwd(),
//   NODE_ENV ? `.env.${NODE_ENV}` : '.env',
// );
// // Load environment variables from the .env file
// console.log(`envPath: ${envPath}`);
// dotenv.config({ path: envPath });

// log(`envPath: ${envPath}`);
const settings = {
  PORT: process.env.PORT ?? 3000,
  HOST: process.env.HOST ?? 'http://localhost',
  ORIGIN_URL: process.env.ORIGIN_URL ?? 'http://localhost:5173',
  ORIGIN_REMOTE: process.env.ORIGIN_REMOTE ?? 'http://192.168.88.49:5173',
  ENABLE_CRON: process.env.ENABLE_CRON === 'true',
};
console.log(JSON.stringify(settings, null, 2));
const app = express();

// app.use((req, res, next) => {
//   console.log(`Incoming Request: ${req.method} ${req.HOST}`);
//   console.log(`ORIGIN_URL: ${req.headers.ORIGIN_URL}`);
//   console.log(`Headers:`, req.headers);
//   next();
// });

// enable cors
// app.use(
//   cors({
//     //TODO: change this to the frontend HOST via .env
//     origin: [
//       // settings.ORIGIN_URL,
//       settings.ORIGIN_REMOTE,
//     ], //! Can't use '*' with credentials
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true, // allow sending cookies/credentials.
//   }),
// );

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // console.log('CORS Origin Check on:', origin);
//       const allowedOrigins = [settings.ORIGIN_URL, settings.ORIGIN_REMOTE];
//       // Allow requests with no origin (like mobile apps or curl requests)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//     maxAge: 500, // Cache preflight response for 1 hour
//   }),
// );

// app.options('*', (req, res) => {
// console.log('Preflight Request:', req.headers);
//   res.header('Access-Control-Allow-ORIGIN_URL', 'http://localhost:5173'); // Match your frontend HOST
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.sendStatus(204); // No Content
// });

// File size limit
app.use(express.json({ limit: '350mb' }));
app.use(express.urlencoded({ extended: true, limit: '350mb' }));

app.use('/procedure', procedureRouter);
app.use('/crud', crudRouter);

app.all('*', (req, res) => {
  res.status(500).json({
    message: 'You have reached the API server',
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    headers: req.headers,
  });
});
app.use(expressErrorHandler);

app.listen(settings.PORT, () => {
  console.log(`App listening at ${settings.HOST}:${settings.PORT}`);
});

// Initialize cron jobs
if (settings.ENABLE_CRON) {
  console.log('Cron jobs enabled');
  // InitiateCronJobs();
} else console.warn('Cron Jobs not Enabled');
// console.log('Cron jobs initialized');
