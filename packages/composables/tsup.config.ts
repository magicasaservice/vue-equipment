import { defineConfig } from 'tsup'
import { resolve } from 'path'

export default defineConfig({
  entry: [resolve(__dirname, './index.ts')],
  outDir: resolve(__dirname, '../../dist/composables'),
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['vue', '@vueuse/shared', '@vueuse/core'],
})
