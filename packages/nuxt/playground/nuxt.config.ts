import * as path from 'path'
// @ts-ignore
import { kebabCase } from 'scule'

import { plugins, composables } from '../../metadata'

export default defineNuxtConfig({
  modules: [
    '@maas/vue-equipment/nuxt',
    '@maas/mirror/nuxt',
    '@nuxtjs/tailwindcss',
  ],

  vueEquipment: {
    plugins: true,
    composables: true,
  },

  mirror: {
    components: true,
  },

  devtools: { enabled: false },

  typescript: {
    includeWorkspace: true,
  },

  tailwindcss: {
    viewer: false,
  },

  alias: {
    '@maas/mirror/tokens': path.resolve(__dirname, '../../../.maas/tokens/css'),
    '@maas/vue-equipment/nuxt': path.resolve(__dirname, '../../../dist/nuxt'),
    '@maas/vue-equipment/utils': path.resolve(__dirname, '../../../dist/utils'),
  },

  css: [
    'fonts/index/stylesheet.css',
    'fonts/interface/stylesheet.css',
    'fonts/mirage/stylesheet.css',
    '@maas/mirror/tokens/components/index.css',
    '@maas/mirror/tokens/theme/dark/components/index.css',
    '@maas/mirror/tokens/application.css',
    '@maas/mirror/tokens/theme/dark/application.css',
  ],

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

  compatibilityDate: '2024-10-04',
})
