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
        dirs: [resolve(__dirname, '.vitepress/theme/components')],
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
    // We need this to resolve the aliases in the demo.vue files
    resolve: {
      alias: [
        {
          find: '@maas/vue-equipment/composables',
          replacement: resolve(__dirname, '../../packages/composables'),
        },
        {
          find: '@maas/vue-equipment/plugins',
          replacement: resolve(__dirname, '../../packages/plugins'),
        },
      ],
      dedupe: ['vue', '@vue/runtime-core'],
    },
  }
})
