import { FlatCompat } from '@eslint/eslintrc';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser'; // ✅ Explicitly import TypeScript parser

const compat = new FlatCompat();

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next'),
  {
    linterOptions: {
      reportUnusedDisableDirectives: true, // ✅ Correct replacement for deprecated option
    },
    plugins: {
      '@typescript-eslint': tseslint, // ✅ Import plugin correctly
    },
    languageOptions: {
      parser: tsparser, // ✅ Correct way to set parser in Flat Config
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    ignores: ['.next/'],
  },
];

export default eslintConfig;
