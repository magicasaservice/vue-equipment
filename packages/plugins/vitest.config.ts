import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'

import { plugins } from '../../packages/metadata'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/test/**/*.spec.ts'],
  },
  resolve: {
    alias: [
      ...plugins.map((plugin) => {
        return {
          find: `@maas/vue-equipment/plugins/${plugin.name}/css`,
          replacement: resolve(__dirname, `/${plugin.name}/src/css`),
        }
      }),
      {
        find: '@maas/vue-equipment/plugins',
        replacement: resolve(__dirname),
      },
      {
        find: '@maas/vue-equipment/composables',
        replacement: resolve(__dirname, '../composables'),
      },
      {
        find: '@maas/vue-equipment/utils/css',
        replacement: resolve(__dirname, '../utils/src/css'),
      },
      {
        find: '@maas/vue-equipment/utils',
        replacement: resolve(__dirname, '../utils'),
      },
    ],
    dedupe: ['vue'],
  },
})
