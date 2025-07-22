import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import path from 'path';
import tailwindcss from 'tailwindcss';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  // Load all env variables regardless of prefix
  const env = loadEnv(mode, process.cwd(), '');
  const apiServerUrl = env.VITE_APP_API_SERVER_URL;
  if (!apiServerUrl) {
    throw new Error('VITE_APP_API_SERVER_URL is not defined');
  }

  return {
    plugins: [TanStackRouterVite(), viteReact(), visualizer({ open: true })],
    define: {
      __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
    },
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
    resolve: {
      alias: {
        // '@server': path.resolve(__dirname, '../server/src'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        // '/api': apiServerUrl,
        '/api': {
          target: apiServerUrl,
          changeOrigin: true,
          // secure: false,
          rewrite: (path) => path.replace('/api', ''),
        },
      },

      cors: {
        origin: apiServerUrl, // Use the server URL from the env
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            tanstack: [
              '@tanstack/react-query',
              '@tanstack/react-router',
              '@tanstack/react-table',
            ],
            ui: [
              'react',
              'react-dom',
              'react-aria',
              'react-aria-components',
              'react-datepicker',
              'react-day-picker',
              'react-dom',
              'react-error-boundary',
              'react-hook-form',
              'react-pdf',
              'react-tailwindcss-datepicker',
              'recharts',
              'sonner',
              'echarts-for-react',
              'framer-motion',
              'tailwind-merge',
              'tailwindcss-animate',
            ],
            zod: ['zod'],
            decimalJs: ['decimal.js'],
            radix: [
              '@radix-ui/react-dialog',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-avatar',
              '@radix-ui/react-collapsible',
              '@radix-ui/react-direction',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-icons',
              '@radix-ui/react-label',
              '@radix-ui/react-popover',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slot',
              '@radix-ui/react-switch',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toggle',
              '@radix-ui/react-toggle-group',
              '@radix-ui/react-tooltip',
            ],
          },
        },
      },
    },
  };
});
