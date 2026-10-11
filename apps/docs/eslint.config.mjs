import { nuxtPreset } from '@maas/config/eslint-nuxt-preset.mjs'

export default [...nuxtPreset, { ignores: ['.nuxt', '.output', '.data'] }]
