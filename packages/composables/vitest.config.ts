import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@maas/vue-equipment/utils',
        replacement: resolve(__dirname, '../utils/index.ts'),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    include: ['**/*.test.ts'],
    globals: true,
  },
})
