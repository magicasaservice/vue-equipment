import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    lib: {
      entry: [
        resolve(__dirname, 'packages/composables/index.ts'),
        resolve(__dirname, 'packages/plugins/index.ts'),
      ],
      name: '@maas/vue-equipment',
    },
    rollupOptions: {
      external: [
        'vue',
        '@vueuse/core',
        '@vueuse/integrations',
        '@vueuse/shared',
        'animejs',
        'mitt',
        'hls.js',
      ],
      output: {
        preserveModules: true,
        sourcemap: true,
      },
    },
  },
})
