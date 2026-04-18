// @ts-check
import tsParser from '@typescript-eslint/parser'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    name: 'tryutils/typescript-and-javascript',
    files: ['**/*.ts', '**/*.mts', '**/*.cts', '**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
    },
  },
  {
    name: 'tryutils/typescript-vue-parser',
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
  },
  {
    name: 'tryutils/phase-1-globals-and-rules',
    languageOptions: {
      globals: {
        defineNuxtConfig: 'readonly',
        $t: 'readonly',
        NodeJS: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'off',
      'nuxt/prefer-import-meta': 'warn',
    },
  },
  {
    name: 'tryutils/ignores',
    ignores: ['.nuxt/**', '.output/**', 'dist/**', 'node_modules/**'],
  },
)
