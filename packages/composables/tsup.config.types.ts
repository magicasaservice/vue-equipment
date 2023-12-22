import { defineConfig } from 'tsup'
import { resolve } from 'node:path'

export default defineConfig({
  entry: [resolve(__dirname, './*/index.ts')],
  outDir: resolve(__dirname, '../../types/composables'),
  external: ['vue', '@vueuse/core'],
  clean: true,
  minify: false,
  bundle: false,
})
