import { mkdist } from 'mkdist'
import { resolve } from 'path'

mkdist({
  declaration: true,
  addRelativeDeclarationExtensions: true,
  distDir: resolve(__dirname, '../../../dist/plugins'),
  rootDir: resolve(__dirname, './..'),
  srcDir: resolve(__dirname, './..'),
  pattern: [
    '**',
    '!index.md',
    '!node_modules',
    '!package.json',
    '!pnpm-lock.yaml',
    '!shims-vue.d.ts',
    '!**/demo.vue',
    '!**/index.md',
    '!scripts/*',
    '!*.config.json',
  ],
})
