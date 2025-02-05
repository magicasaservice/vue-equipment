import { mkdist } from 'mkdist'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
    '!**/demo/**/*.vue',
    '!**/index.md',
    '!scripts/*',
    '!*.config.*',
  ],
})
