import * as path from 'path'

export default defineNuxtConfig({
  modules: ['../src/module'],
  vueEquipment: {
    plugins: true,
    composables: true,
  },
  devtools: { enabled: false },
  typescript: {
    includeWorkspace: true,
  },
  alias: {
    '@maas/vue-equipment': path.resolve(__dirname, '../../../dist'),
    '@maas/vue-equipment/plugins': path.resolve(
      __dirname,
      '../../../dist/plugins',
    ),
    '@maas/vue-equipment/composables': path.resolve(
      __dirname,
      '../../../dist/composables',
    ),
  },
})
