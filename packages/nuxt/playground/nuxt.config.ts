import * as path from 'path'
import { kebabCase } from 'scule'

import { plugins, composables } from '../../metadata'

export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt', '@unocss/nuxt'],
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
    '@maas/vue-equipment/nuxt': path.resolve(__dirname, '../../../dist/nuxt'),
  },
  // Load demo files as routes
  hooks: {
    'pages:extend'(pages) {
      for (const plugin of plugins) {
        pages.push({
          name: plugin.name,
          path: `/${kebabCase(plugin.name)}`,
          file: `../../plugins/${plugin.name}/demo.vue`,
        })
      }

      for (const composable of composables) {
        pages.push({
          name: composable.name,
          path: `/${kebabCase(composable.name)}`,
          file: `../../composables/${composable.name}/demo.vue`,
        })
      }
    },
  },
  // Use public folder from docs
  dir: {
    public: path.resolve(__dirname, '../../../apps/docs/public'),
  },
})
