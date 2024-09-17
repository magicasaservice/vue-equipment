import mirrorPreset from './../../.maas/tailwind.preset.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './.vitepress/theme/**/*.vue',
    './src/content/**/*.md',
    '../../packages/**/demo.vue',
    '../../packages/**/demo/*.vue',
    '!**/node_modules/**',
  ],
  presets: [mirrorPreset],
  theme: {
    extend: {
      fontFamily: {
        mono: 'var(--vt-font-family-mono)',
      },
    },
  },
}
