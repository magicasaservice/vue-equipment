import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { MarkdownTransform } from './.vitepress/plugins/markdownTransform'
import UnoCSS from 'unocss/vite'

export default defineConfig(async () => {
  return {
    server: {
      hmr: {
        overlay: false,
      },
      fs: {
        allow: [resolve(__dirname, '..')],
      },
    },
    plugins: [
      // custom
      MarkdownTransform(),
      Components({
        dirs: resolve(__dirname, '.vitepress/theme/components'),
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          IconsResolver({
            componentPrefix: '',
          }),
        ],
        dts: './.vitepress/components.d.ts',
        transformer: 'vue3',
      }),
      UnoCSS(),
    ],
    resolve: {
      alias: [
        {
          find: '@maas/vue-equipment/composables',
          replacement: resolve(__dirname, 'composables/index.ts'),
        },
        {
          find: '@maas/vue-equipment/metadata',
          replacement: resolve(__dirname, 'metadata/index.ts'),
        },
        {
          find: '@maas/vue-equipment/plugins',
          replacement: resolve(__dirname, 'plugins/index.ts'),
        },
        {
          find: /^@maas\/vue-equipment\/utils$/,
          replacement: resolve(__dirname, 'utils/index.ts'),
        },
        {
          find: /^@maas\/vue-equipment\/utils\/css/,
          replacement: resolve(__dirname, 'utils/src/css'),
        },
      ],
      dedupe: ['vue', '@vue/runtime-core'],
    },
  }
})
