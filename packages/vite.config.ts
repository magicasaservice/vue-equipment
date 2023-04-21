import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { MarkdownTransform } from './.vitepress/plugins/markdownTransform'

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
    ],
    resolve: {
      alias: {
        '@magicasaservice/vue-equipment/composables': resolve(
          __dirname,
          'composables/index.ts'
        ),
      },
      dedupe: ['vue', '@vue/runtime-core'],
    },
  }
})
