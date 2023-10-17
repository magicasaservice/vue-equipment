import { defineConfig } from 'tsup'
import { resolve } from 'path'
import { cpSync } from 'fs'

export default defineConfig({
  entry: [resolve(__dirname, './index.ts')],
  outDir: resolve(__dirname, '../../dist/utils'),
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  onSuccess: async () => {
    // Copy type utils to dist
    await cpSync(
      resolve(__dirname, './src/types'),
      resolve(__dirname, '../../dist/utils/types'),
      {
        recursive: true,
      },
    )
    // Copy css utils to dist
    await cpSync(
      resolve(__dirname, './src/css'),
      resolve(__dirname, '../../dist/utils/css'),
      {
        recursive: true,
      },
    )
  },
})
