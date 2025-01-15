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
      'vue/attributes-order': 'warn',
    },
  }
)
