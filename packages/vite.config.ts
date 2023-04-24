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
      alias: {
        '@vue-equipment/composables': resolve(
          __dirname,
          'composables/index.ts'
        ),
        '@vue-equipment/metadata': resolve(__dirname, 'metadata/index.ts'),
      },
      dedupe: ['vue', '@vue/runtime-core'],
    },
  }
})
