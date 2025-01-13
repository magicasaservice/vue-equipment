// import eslint from '@eslint/js'
// import tseslint from 'typescript-eslint'
// import prettierRecommended from 'eslint-plugin-prettier/recommended'
// import pluginVue from 'eslint-plugin-vue'

// export const vuePreset = [
//   eslint.configs.recommended,
//   ...tseslint.configs.recommended,
//   ...pluginVue.configs['flat/recommended'],
//   prettierRecommended,
//   { rules: { '@typescript-eslint/no-duplicate-enum-values': 'off' } },
//   {
//     ignores: ['node_modules', '.turbo', '**/dist', '**/cache'],
//   },
// ]

import pluginVue from 'eslint-plugin-vue'
import {
  defineConfig,
  createConfig as vueTsEslintConfig,
} from '@vue/eslint-config-typescript'

export const vuePreset = defineConfig(
  pluginVue.configs['flat/essential'],
  vueTsEslintConfig(),
  {
    rules: {
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/attributes-order': 'error',
    },
  }
)
