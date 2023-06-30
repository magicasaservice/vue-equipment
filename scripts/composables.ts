import { build } from 'esbuild'
import { resolve } from 'path'

import type { Format } from 'esbuild'

const formats: Format[] = ['cjs', 'esm']

formats.forEach((format) => {
  build({
    entryPoints: ['./packages/composables/index.ts'],
    bundle: true,
    minify: false,
    sourcemap: true,
    outdir: resolve(__dirname, '../dist/composables'),
    outExtension: { '.js': `.${format === 'cjs' ? 'cjs' : 'mjs'}` },
    format: format,
  })
})
