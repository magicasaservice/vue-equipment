import { vuePreset } from '@maas/config/eslint-vue-preset.mjs'
export default [...vuePreset, { ignores: ['.vitepress/cache', '.vitepress/dist'] }]
