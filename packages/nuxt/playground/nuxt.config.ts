import * as path from 'path'
import tailwindcss from '@tailwindcss/vite'

const dist = '../../../dist'

export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt', '@maas/mirror/nuxt'],

  vueEquipment: {
    plugins: true,
    composables: true,
  },

  mirror: {
    // v2 registers every export and takes a prefix instead of a component
    // list. `Mirror` keeps `MButton` and friends free for the compatibility
    // wrappers, which is what the demos render.
    prefix: 'Mirror',
  },

  devtools: { enabled: false },

  typescript: {
    includeWorkspace: true,
  },

  tailwindcss: {
    viewer: false,
  },

  alias: {
    '@maas/vue-equipment/plugins/MagicPlayer/css': path.resolve(
      __dirname,
      `${dist}/plugins/MagicPlayer/src/css`
    ),
    '@maas/vue-equipment/nuxt': path.resolve(__dirname, `../src/module`),
    '@maas/vue-equipment/plugins': path.resolve(__dirname, `${dist}/plugins`),
    '@maas/vue-equipment/composables': path.resolve(
      __dirname,
      `${dist}/composables`
    ),
    '@maas/vue-equipment/utils': path.resolve(__dirname, `${dist}/utils`),
    '@maas/mirror/tokens': path.resolve(__dirname, '../../../.maas/tokens/css'),
  },

  css: [
    path.resolve(__dirname, './assets/tailwind.css'),
    'fonts/index/stylesheet.css',
    'fonts/interface/stylesheet.css',
    'fonts/mirage/stylesheet.css',
    '@maas/mirror/tokens/application.css',
    '@maas/mirror/tokens/theme/dark/application.css',
    // Mirror emits no `component/*` tree any more, so the compatibility layer
    // carries the component CSS the demos style themselves with.
    'mirror-compat/css/index.css',
  ],

  // Use public folder from docs
  dir: {
    public: path.resolve(__dirname, '../../../apps/docs/public'),
  },

  // https://github.com/nuxt/nuxt/issues/31326
  vite: {
    plugins: [tailwindcss()],
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
