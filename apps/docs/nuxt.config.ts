import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { plugins } from '../../packages/metadata'

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
  extends: ['@maas/docs'],

  docs: {
    tokens: resolve(repositoryRoot, '.maas'),
    sources: [
      resolve(packagesDir, 'plugins'),
      resolve(packagesDir, 'composables'),
      resolve(packagesDir, 'mirror-compat/src'),
    ],
    previews: [
      resolve(packagesDir, 'plugins/*/demo/*.vue'),
      resolve(packagesDir, 'composables/*/demo/*.vue'),
    ],
  },

  // The layer’s `@maas/vue-equipment/nuxt` resolves to the module source
  // through the aliases below, so every page tests the module and a change to
  // a plugin shows up without a build.
  vueEquipment: {
    plugins: true,
    composables: true,
  },

  // `Mirror` keeps `MButton` and friends free for the compatibility wrappers,
  // which is what the demos render.
  mirror: {
    prefix: 'Mirror',
  },

  app: {
    head: {
      htmlAttrs: { 'data-theme': 'vue-equipment' },
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
    resolve(tokensDir, 'theme/vue-equipment/light/application.css'),
    resolve(tokensDir, 'theme/vue-equipment/dark/application.css'),
  ],

  // The specific paths come first: the first alias that matches wins.
  alias: {
    '@maas/vue-equipment/nuxt': resolve(packagesDir, 'nuxt/src/module'),
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
  },

  // The demos render `<m-*>` tags, some without importing them.
  components: [
    '~/components',
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
    },
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
      // The demos and the logo draw symbols as `<i-maas-*>` tags, compiled
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
