import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Icons from 'unplugin-icons/vite'

export default defineConfig(async () => {
  return {
    server: {
      hmr: {
        overlay: false,
      },
    },
    plugins: [Icons()],
    // We need this to resolve the aliases in the plugin files
    // CSS imports from utils need a higher priority than JS imports from utils
    resolve: {
      alias: [
        {
          find: '@maas/vue-equipment/composables',
          replacement: resolve(__dirname, '../../packages/composables'),
        },
        {
          find: '@maas/vue-equipment/plugins',
          replacement: resolve(__dirname, '../../packages/plugins'),
        },
        {
          find: '@maas/vue-equipment/utils/css',
          replacement: resolve(__dirname, '../../packages/utils/src/css'),
        },
        {
          find: '@maas/vue-equipment/utils',
          replacement: resolve(__dirname, '../../packages/utils'),
        },
        {
          find: 'fonts',
          replacement: resolve(__dirname, '../../packages/fonts/dist'),
        },
        {
          find: './theme/components',
          replacement: resolve(__dirname, './.vitepress/theme/components'),
        },
      ],
      dedupe: ['vue'],
    },
    build: {
      rollupOptions: {
        external: ['@maas/vue-equipment'],
      },
    },
  }
})
