import * as path from 'path'

export default defineNuxtConfig({
  modules: ['@maas/vue-equipment', '@unocss/nuxt'],
  vueEquipment: {
    plugins: true,
    composables: true,
  },
  devtools: { enabled: false },
  typescript: {
    includeWorkspace: true,
  },
  css: ['@unocss/reset/tailwind.css'],
  alias: {
    '@maas/vue-equipment': path.resolve(__dirname, '../../../dist'),
  },
})
