import { defineConfig } from 'tsup'
import { resolve } from 'node:path'

export default defineConfig({
  entry: [resolve(__dirname, './index.ts')],
  outDir: resolve(__dirname, '../../dist/composables'),
  external: ['@maas/magic-timer', '@vueuse/core', 'luxon', 'vue'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
})
