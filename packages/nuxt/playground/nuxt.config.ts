import * as path from 'path'
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
    '@maas/vue-equipment/nuxt': path.resolve(__dirname, '../src/module'),
    '@maas/vue-equipment/composables': path.resolve(
      __dirname,
      '../../../dist/composables'
    ),
    '@maas/vue-equipment/plugins': path.resolve(
      __dirname,
      '../../../dist/plugins'
    ),
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
      // for (const plugin of plugins) {
      //   try {
      //     pages.push({
      //       name: plugin.name,
      //       path: `/${kebabCase(plugin.name)}`,
      //       file: `../../plugins/${plugin.name}/demo/index.vue`,
      //     })
      //   } catch (e: unknown) {
      //     console.error(e)
      //   }
      // }

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
