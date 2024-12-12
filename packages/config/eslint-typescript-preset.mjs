import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export const typescriptPreset = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierRecommended,
  { rules: { '@typescript-eslint/no-duplicate-enum-values': 'off' } },
  { ignores: ['.prettierrc.cjs', 'node_modules'] },
]
