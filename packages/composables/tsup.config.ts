import { defineConfig } from 'tsup'
import { resolve } from 'path'

export default defineConfig({
  entry: [resolve(__dirname, './index.ts')],
  outDir: resolve(__dirname, '../../dist/composables'),
  external: ['vue', '@vueuse/core'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
})
