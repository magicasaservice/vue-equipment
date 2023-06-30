import vue from 'esbuild-plugin-vue'
import { build } from 'esbuild'

import type { Format } from 'esbuild'

const formats: Format[] = ['cjs', 'esm']

formats.forEach((format) => {
  build({
    entryPoints: ['./packages/composables'],
    bundle: true,
    minify: false,
    sourcemap: true,
    outdir: 'dist',
    outExtension: { '.js': '.mjs' },
    format: format,
  })
})

formats.forEach((format) => {
  build({
    entryPoints: ['./packages/plugins/MagicPlayer/src/MagicPlayer.vue'],
    bundle: true,
    minify: false,
    outdir: 'dist',
    outExtension: { '.js': '.mjs' },
    format: format,
    plugins: [vue()],
    external: ['vue'],
  })
})
