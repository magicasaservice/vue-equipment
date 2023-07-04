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
    '@maas/vue-equipment': path.resolve(__dirname, '../../../dist'),
  },
})
