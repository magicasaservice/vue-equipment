import { resolve } from 'node:path'
import { defineConfig } from 'vite'

import IconResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import tailwindcss from '@tailwindcss/vite'

import { plugins } from '../../packages/metadata'

function splitAtNumber(str: string) {
  const match = str.match(/\d/)
  if (!match) {
    return str
  }

  const index = match.index
  return str.slice(0, index) + '-' + str.slice(index)
}

const overrides = ['VPNav', 'VPLocalNav', 'VPNavBarTitle', 'VPHome', 'VPFooter']

export default defineConfig(async () => {
  return {
    server: {
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      tailwindcss(),
      Components({
        resolvers: [IconResolver({ customCollections: ['maas'] })],
        dts: 'apps/docs/types/components.d.ts',
      }),
      Icons({
        compiler: 'vue3',
        customCollections: {
          maas: async (iconName) => {
            return await fetch(
              `https://symbols.maas.earth/maas/${splitAtNumber(iconName)}.svg`
            ).then((res) => res.text())
          },
        },
      }),
    ],
    // We need this to resolve the aliases in the plugin files
    // CSS imports from utils need a higher priority than JS imports from utils
    resolve: {
      alias: [
        {
          find: '@maas/vue-equipment/composables',
          replacement: resolve(__dirname, '../../packages/composables'),
        },
        ...plugins.map((plugin) => {
          return {
            find: `@maas/vue-equipment/plugins/${plugin.name}/css`,
            replacement: resolve(
              __dirname,
              `../../packages/plugins/${plugin.name}/src/css`
            ),
          }
        }),
        {
          find: '@maas/vue-equipment/plugins',
          replacement: resolve(__dirname, '../../packages/plugins'),
        },
        {
          find: '@maas/vue-equipment/utils/css',
          replacement: resolve(__dirname, '../../packages/utils/src/css'),
        },
        {
          find: '@maas/vue-equipment/utils',
          replacement: resolve(__dirname, '../../packages/utils'),
        },
        {
          find: '@maas/mirror/tailwind',
          replacement: resolve(__dirname, '../../.maas/tailwind.preset.css'),
        },
        {
          find: 'fonts',
          replacement: resolve(__dirname, '../../packages/fonts/dist'),
        },
        ...overrides.map((override) => {
          return {
            find: new RegExp(`^.*\\/${override}\\.vue$`),
            replacement: resolve(
              __dirname,
              `./.vitepress/theme/components/overrides/${override}.vue`
            ),
          }
        }),
      ],
      dedupe: ['vue'],
    },
    build: {
      rollupOptions: {
        external: ['@maas/vue-equipment'],
      },
    },
    ssr: {
      noExternal: ['wheel-gestures'],
    },
  }
})
