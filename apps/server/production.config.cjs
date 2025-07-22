module.exports = {
  apps: [
    {
      name: 'clinic-gate-server',
      script: './dist/app.js',
      watch: ['./dist', './node_modules/'],
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,
      cron_restart: '0 0 * * *', // Restart daily at midnight
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
