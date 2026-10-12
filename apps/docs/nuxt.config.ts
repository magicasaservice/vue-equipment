import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { plugins } from '../../packages/metadata'
import { colorModeStorageKey } from './app/utils/color-mode'
import { mirrorDark, mirrorLight } from './shiki-theme'

const currentDir = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(currentDir, '../..')
const packagesDir = resolve(repositoryRoot, 'packages')
const tokensDir = resolve(repositoryRoot, '.maas/tokens/css')

// The symbol set lives on its own server. Names carry their weight as a
// trailing number, which the URL separates with a dash.
async function loadSymbol(name: string) {
  const file = name.replace(/-?(\d+)$/, '-$1')
  const response = await fetch(`https://symbols.maas.earth/maas/${file}.svg`)
  if (!response.ok) {
    throw new Error(`The symbol ${file} could not be loaded`)
  }
  return response.text()
}

export default defineNuxtConfig({
  compatibilityDate: '2026-08-19',
  devtools: { enabled: false },

  modules: [
    // Ahead of Nuxt Content, whose options it adds to.
    [
      resolve(currentDir, 'component-previews'),
      {
        roots: [
          resolve(packagesDir, 'plugins'),
          resolve(packagesDir, 'composables'),
        ],
      },
    ],
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@maas/mirror/nuxt',
    resolve(packagesDir, 'nuxt/src/module'),
  ],

  // The docs run the repository’s own Nuxt module against the plugin
  // sources, so every page tests the module and a change to a plugin shows up
  // without a build.
  vueEquipment: {
    plugins: true,
    composables: true,
  },

  // `Mirror` keeps `MButton` and friends free for the compatibility wrappers,
  // which is what the demos render.
  mirror: {
    prefix: 'Mirror',
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    dataValue: 'color-mode',
    storageKey: colorModeStorageKey,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en', 'data-theme': 'vue-equipment' },
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        {
          rel: 'preconnect',
          href: 'https://fonts.maas.engineering',
          crossorigin: 'anonymous',
        },
        {
          rel: 'dns-prefetch',
          href: 'https://fonts.maas.engineering',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.maas.engineering/mirage/1.1.3/stylesheet.css',
          crossorigin: 'anonymous',
          tagPriority: 'critical',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.maas.engineering/index/stylesheet.css',
          crossorigin: 'anonymous',
          tagPriority: 'critical',
        },
      ],
      script: [
        {
          src: 'https://stats.maas.earth/js/script.outbound-links.tagged-events.js',
          defer: true,
          'data-domain': 'vue.equipment',
        },
      ],
    },
  },

  css: [
    resolve(tokensDir, 'application.css'),
    resolve(tokensDir, 'breakpoint/sm/application.css'),
    resolve(tokensDir, 'theme/dark/application.css'),
    resolve(tokensDir, 'theme/vue-equipment/light/application.css'),
    resolve(tokensDir, 'theme/vue-equipment/dark/application.css'),
    '~/assets/css/tailwind.css',
    '~/assets/css/main.css',
  ],

  // The specific paths come first: the first alias that matches wins.
  alias: {
    ...Object.fromEntries(
      plugins.map((plugin) => [
        `@maas/vue-equipment/plugins/${plugin.name}/css`,
        resolve(packagesDir, `plugins/${plugin.name}/src/css`),
      ])
    ),
    '@maas/vue-equipment/plugins': resolve(packagesDir, 'plugins'),
    '@maas/vue-equipment/composables': resolve(packagesDir, 'composables'),
    '@maas/vue-equipment/utils/css': resolve(packagesDir, 'utils/src/css'),
    '@maas/vue-equipment/utils': resolve(packagesDir, 'utils'),
    '@maas/mirror/tailwind': resolve(
      repositoryRoot,
      '.maas/tailwind.preset.css'
    ),
  },

  components: [
    { path: './components/base/', pathPrefix: false },
    { path: './components/docs/', pathPrefix: false },
    { path: './components/prose/', global: true },
    { path: './components/content/', global: true },
    // The demos render `<m-*>` tags, some without importing them.
    {
      path: resolve(packagesDir, 'mirror-compat/src/components'),
      prefix: 'M',
      global: true,
    },
  ],

  content: {
    build: {
      pathMeta: {
        // Plugin and composable pages keep their export’s casing in the URL,
        // `/plugins/MagicDrawer`, as they always have.
        slugifyOptions: { lower: false },
      },
      markdown: {
        toc: { depth: 3, searchDepth: 2 },
        highlight: {
          theme: { default: mirrorLight, dark: mirrorDark },
          langs: [
            'bash',
            'css',
            'html',
            'ini',
            'js',
            'json',
            'sh',
            'ts',
            'typescript',
            'vue',
          ],
        },
      },
    },
  },

  mdc: {
    components: { prose: true },
  },

  hooks: {
    // A page’s source link and its Markdown twin both need the file it was
    // read from, which the collection’s sources only know as a glob.
    'content:file:afterParse'({ file, collection, content }) {
      if (collection.name === 'docs' && file.path) {
        content.sourcePath = relative(repositoryRoot, file.path)
      }
    },
  },

  nitro: {
    // The files behind the pages, which `/raw/<path>.md` serves. They are
    // bundled for the server alone, so the content database the browser
    // downloads never carries a second copy of every page. The pattern
    // matches the `docs` collection’s sources in `content.config.ts`.
    serverAssets: [
      {
        baseName: 'markdown',
        dir: repositoryRoot,
        pattern:
          '{apps/docs/content/0.overview/*.md,packages/{plugins,composables}/*/index.md}',
      },
    ],
  },

  // The overview pages used to be served as `.html` files, and those URLs are
  // linked from elsewhere.
  routeRules: {
    '/overview/introduction.html': {
      redirect: { to: '/overview/introduction', statusCode: 301 },
    },
    '/overview/getting-started.html': {
      redirect: { to: '/overview/getting-started', statusCode: 301 },
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
      // The demos and the shell draw symbols as `<i-maas-*>` tags, compiled
      // into the bundle at build time.
      Components({
        dirs: [],
        dts: false,
        resolvers: [IconsResolver({ customCollections: ['maas'] })],
      }),
      Icons({
        compiler: 'vue3',
        customCollections: { maas: loadSymbol },
      }),
    ],
  },
})
