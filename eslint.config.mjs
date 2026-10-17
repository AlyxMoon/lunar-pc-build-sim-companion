import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'

export default defineConfig([
  globalIgnores(['dist/**', 'tests/coverage/**', 'src/assets/data/**', '.local-toolchain/**']),
  {
    files: ['**/*.{js,mjs,ts,mts,vue}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'comma-dangle': ['error', 'always-multiline'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },
  ...vue.configs['flat/strongly-recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
    rules: {
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/v-on-event-hyphenation': ['warn', 'never'],
    },
  },
])
