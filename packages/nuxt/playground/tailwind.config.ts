import mirrorPreset from '../../../.maas/tailwind.preset.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './../plugins/**/*.vue',
    './../plugins/**/demo/*.vue',
    './../plugins/**/demo/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue',
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
