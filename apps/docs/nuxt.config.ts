import { dirname, resolve } from 'node:path'
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
    'fonts/mirage/stylesheet.css',
    'fonts/index/stylesheet.css',
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

  // The overview pages used to be served as `.html` files, and those URLs are
  // linked from elsewhere. Each redirect targets the folder, so a host that
  // resolves `/overview/introduction` to `introduction.html` first cannot
  // send a reader around in a loop.
  routeRules: {
    '/overview/introduction.html': { redirect: '/overview/introduction/' },
    '/overview/getting-started.html': {
      redirect: '/overview/getting-started/',
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/overview/introduction.html', '/overview/getting-started.html'],
      // A link to a page that does not exist fails the build.
      failOnError: true,
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
