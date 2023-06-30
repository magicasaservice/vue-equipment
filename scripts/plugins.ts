import { mkdist } from 'mkdist'
import { resolve } from 'path'

mkdist({
  declaration: true,
  distDir: resolve(__dirname, '../dist/plugins'),
  rootDir: resolve(__dirname, '../packages/plugins'),
  srcDir: '.',
  pattern: [
    '**',
    '!index.md',
    '!node_modules',
    '!package.json',
    '!pnpm-lock.yaml',
    '!shims-vue.d.ts',
    '!**/nuxt.ts',
    '!**/demo.vue',
    '!**/index.md',
  ],
})
