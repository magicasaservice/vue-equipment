import mirrorPreset from './../../.maas/tailwind.preset.js'
import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './.vitepress/theme/**/*.vue',
    './src/content/**/*.md',
    '../../packages/**/demo.vue',
    '../../packages/**/demo/*.vue',
    '../../packages/**/demo/**/*.vue',
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
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-none::-webkit-scrollbar': {
          display: 'none',
        },
        '.scrollbar-none': {
          '-ms-overflow-style': 'none',
          scrollbarWidth: 'none',
        },
      })
    }),
  ],
}
