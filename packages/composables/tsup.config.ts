import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    './useCountdown/index.ts',
    './useEasings/index.ts',
    './useMetaViewport/index.ts',
    './useScrollTo/index.ts',
    './useScrollLockPadding/index.ts',
  ],
  outDir: '../../dist/composables',
  external: ['@maas/magic-timer', '@vueuse/core', 'luxon', 'vue'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
})
