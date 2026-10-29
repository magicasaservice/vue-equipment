import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    clearMocks: true,
    environment: 'happy-dom',
    server: {
      deps: {
        // Mirror ships its parts as uncompiled SFCs, so they have to pass
        // through the Vue plugin rather than load as plain Node modules.
        inline: ['@maas/mirror'],
      },
    },
  },
})
