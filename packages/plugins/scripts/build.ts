import { mkdist } from 'mkdist'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

mkdist({
  declaration: true,
  format: 'esm',
  addRelativeDeclarationExtensions: true,
  loaders: ['js', 'vue'],
  distDir: resolve(__dirname, '../../../dist/plugins'),
  rootDir: resolve(__dirname, './..'),
  srcDir: resolve(__dirname, './..'),
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        verbatimModuleSyntax: true,
      },
    },
  },
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
    '!**/demo/**/*.json',
    '!**/index.md',
    '!scripts/*',
    '!*.config.*',
    '!.turbo',
    '!**/.turbo',
  ],
})
