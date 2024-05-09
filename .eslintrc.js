// const { resolve } = require('node:path')

// const project = resolve(process.cwd(), 'tsconfig.json')

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    'next',
    "next/core-web-vitals",
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  // parserOptions: {
  //   project,
  // },
  globals: {
    React: true,
    JSX: true,
  },
  plugins: ['react', 'react-hooks', 'simple-import-sort', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: ['packages/*/tsconfig.json', 'apps/*/tsconfig.json'],
      },
    },
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['node_modules/', 'dist/'],
  // add rules configurations here
  rules: {
    'no-extra-boolean-cast': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/no-unknown-property': 'off',
    'react/prop-types': 'off',
    'import/no-default-export': 'off',
    'react/display-name': 'off',
    'react/no-unescaped-entities': 0,
    curly: ['error', 'multi-line'],
    'react/jsx-no-target-blank': [2, { allowReferrer: true }],
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks:
          '(useIsomorphicLayoutEffect|useDeepCompareMemo|useIsoLayoutEffect|useDebouncedCallback|useThrottledCallback|useGsapContext)',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      2,
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'no-console': [1, { allow: ['warn', 'error'] }],
    '@typescript-eslint/ban-ts-comment': 0,
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: false,
      },
    ],
    // '@typescript-eslint/no-floating-promises': 'error',
    // '@typescript-eslint/await-thenable': 'error',
    // '@typescript-eslint/no-misused-promises': 'error',
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
}