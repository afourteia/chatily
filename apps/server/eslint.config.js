import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import pkg from '@typescript-eslint/eslint-plugin';
const { configs: tsConfigs } = pkg;

export default [
  {
    ignores: ['dist', 'node_modules', 'build', 'public', 'prisma', 'zenstack'],
  },
  {
    files: ['src/**/*.ts', 'template/**/*.ts', 'scripts/**/*.ts'],
    languageOptions: {
      parser: typescriptEslintParser,
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      ...tsConfigs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'never', prev: 'const', next: 'const' },
        { blankLine: 'never', prev: 'let', next: 'let' },
        { blankLine: 'never', prev: 'var', next: 'var' },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
      'no-trailing-spaces': 'warn',
      'no-multi-spaces': 'warn',
      eqeqeq: 'warn',
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-eval': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['*.js', '*.jsx'],
    rules: {
      // Add any JavaScript-specific rules here
    },
  },
  {
    files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
    rules: {
      // Add any common rules here
    },
  },
];
