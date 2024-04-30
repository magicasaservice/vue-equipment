import { mkdist } from 'mkdist'
import { resolve } from 'node:path'

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
    '!tsconfig.json',
    '!**/demo.vue',
    '!**/demo/*.vue',
    '!**/index.md',
    '!scripts/*',
    '!*.config.json',
  ],
})
