// @ts-check
import tsParser from '@typescript-eslint/parser'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
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
        $t: 'readonly',
        NodeJS: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  },
  {
    name: 'tryutils/ignores',
    ignores: ['.nuxt/**', '.output/**', 'dist/**', 'node_modules/**'],
  },
)
