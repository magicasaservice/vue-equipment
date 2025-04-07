import * as path from 'path'

const dist = '../../../dist'

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
    '@maas/vue-equipment/nuxt': path.resolve(__dirname, `${dist}/nuxt/module`),
    '@maas/mirror/tokens': path.resolve(__dirname, '../../../.maas/tokens/css'),
    '@maas/vue-equipment/plugins/MagicPlayer/css': path.resolve(
      __dirname,
      `${dist}/plugins/MagicPlayer/src/css`
    ),
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

  // Use public folder from docs
  dir: {
    public: path.resolve(__dirname, '../../../apps/docs/public'),
  },

  // https://github.com/nuxt/nuxt/issues/31326
  vite: {
    build: {
      rollupOptions: {
        output: {
          sanitizeFileName: true,
        },
      },
    },
  },

  compatibilityDate: '2024-10-04',
})
