/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('path');

module.exports = {
  root: true,
  ignorePatterns: ['dist'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@tanstack/eslint-plugin-router/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:tailwindcss/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    tailwindcss: {
      config: path.join(__dirname, './tailwind.config.js'),
    },
  },
  plugins: [
    // "react-hooks",
    'react-refresh',
    '@typescript-eslint',
    '@tanstack/query',
    '@tanstack/router',
  ],
  rules: {
    // ...require("eslint-plugin-react-hooks").configs.recommended.rules,
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off', // Disable the rule that requires React in scope
    'react/jsx-uses-react': 'off', // Disable the rule that marks React as used
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': true,
        'ts-check': false,
      },
    ],
  },
  globals: {
    ...require('globals').browser,
  },
};
