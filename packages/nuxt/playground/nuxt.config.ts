import * as path from 'path'

export default defineNuxtConfig({
  modules: ['../src/module'],
  vueEquipment: {
    autoImportPlugins: true,
    autoImportComposables: true,
  },
  devtools: { enabled: true },
  typescript: {
    includeWorkspace: true,
  },
  alias: {
    '@maas/vue-equipment/composables': path.resolve(
      __dirname,
      '../../composables'
    ),
  },
})
