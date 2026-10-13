import { fileURLToPath } from 'node:url'
import { defineContentConfig, defineDocsCollections } from '@maas/docs/content'

const packagesDir = fileURLToPath(new URL('../../packages', import.meta.url))

// Only `*/index.md` is content, but the dev watcher walks every folder it is
// not told to skip, and `node_modules` links into the whole store.
const packageExclude = [
  '**/node_modules/**',
  '.turbo/**',
  '*/demo/**',
  '*/src/**',
  '*/tests/**',
  'scripts/**',
  'tests/**',
]

// Plugin and composable pages stay beside their source. The numbered prefixes
// order the sections and never reach a URL.
export default defineContentConfig({
  collections: defineDocsCollections({
    source: [
      { include: '0.overview/*.md' },
      {
        cwd: `${packagesDir}/plugins`,
        include: '*/index.md',
        prefix: '/1.plugins',
        exclude: packageExclude,
      },
      {
        cwd: `${packagesDir}/composables`,
        include: '*/index.md',
        prefix: '/2.composables',
        exclude: packageExclude,
      },
    ],
  }),
})
