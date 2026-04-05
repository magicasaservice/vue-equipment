import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js',
      },
      {
        find: /^@maas\/vue-equipment\/utils\/css\/(.*)/,
        replacement: resolve(__dirname, '../utils/src/css/$1'),
      },
      {
        find: '@maas/vue-equipment/utils',
        replacement: resolve(__dirname, '../utils/index.ts'),
      },
      {
        find: /^@maas\/vue-equipment\/plugins\/(.*)/,
        replacement: resolve(__dirname, './$1'),
      },
      {
        find: /^@maas\/vue-equipment\/composables\/(.*)/,
        replacement: resolve(__dirname, '../composables/$1'),
      },
    ],
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
    include: ['**/__tests__/**/*.test.ts'],
    globals: true,
  },
})
