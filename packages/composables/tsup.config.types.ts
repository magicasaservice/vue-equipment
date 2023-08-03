import { defineConfig } from 'tsup'
import { resolve } from 'path'

export default defineConfig({
  entry: [resolve(__dirname, './*/index.ts')],
  outDir: resolve(__dirname, '../../types/composables'),
  external: ['vue', '@vueuse/shared', '@vueuse/core'],
  clean: true,
  minify: false,
  bundle: false,
})
