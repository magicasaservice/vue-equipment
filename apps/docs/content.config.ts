import { fileURLToPath } from 'node:url'
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

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

const heroAction = z.object({
  text: z.string(),
  link: z.string(),
  mode: z.enum(['solid', 'subtle']).optional(),
})

export default defineContentConfig({
  collections: {
    home: defineCollection({
      type: 'page',
      source: 'index.md',
      schema: z.object({
        hero: z.object({
          name: z.string(),
          tagline: z.string(),
          text: z.string(),
          actions: z.array(heroAction),
        }),
      }),
    }),
    // Plugin and composable pages stay beside their source. The numbered
    // prefixes order the sections and never reach a URL.
    docs: defineCollection({
      type: 'page',
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
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
      }),
    }),
  },
})
