import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export const nuxtPreset = createConfigForNuxt(
  {},
  {
    rules: {
      'vue/html-self-closing': 'off',
      'vue/no-v-html': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
  { ignores: ['.prettierrc', 'dist', 'node_modules'] },
  prettierRecommended
)
