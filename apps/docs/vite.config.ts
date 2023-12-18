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
    },
    plugins: [
      // custom
      UnoCSS(),
      MarkdownTransform(),
      Components({
        dirs: resolve(__dirname, '.vitepress/theme/components'),
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          IconsResolver({
            componentPrefix: '',
          }),
        ],
        dts: '../../docs/apps/.vitepress/components.d.ts',
        transformer: 'vue3',
      }),
    ],
    resolve: {
      alias: [
        {
          find: '@maas/vue-equipment/composables',
          replacement: resolve(__dirname, '../../packages/composables/'),
        },
        {
          find: '@maas/vue-equipment/metadata',
          replacement: resolve(__dirname, '../../packages/metadata/'),
        },
        {
          find: '@maas/vue-equipment/plugins',
          replacement: resolve(__dirname, '../../packages/plugins/'),
        },
        {
          find: /^@maas\/vue-equipment\/utils$/,
          replacement: resolve(__dirname, '../../packages/utils/'),
        },
        {
          find: /^@maas\/vue-equipment\/utils\/css/,
          replacement: resolve(__dirname, '../../packages/utils/src/css'),
        },
        {
          find: '../config/tsconfig',
          replacement: resolve(__dirname, '../../packages/config/tsconfig/'),
        },
      ],
      dedupe: ['vue', '@vue/runtime-core'],
    },
  }
})
