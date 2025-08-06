import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

import { globalIgnores } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
  {
    name: 'app/custom-rules',
    rules: {
      eqeqeq: ['error', 'smart'],
      'no-var': 'error',
      'no-lonely-if': 'error',
      'no-else-return': 'error',
      'vue/html-self-closing': 'off',
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style']
        }
      ],
      'vue/no-useless-v-bind': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/prefer-for-of': ['warn']
    }
  }
)
