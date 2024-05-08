import type { App, Plugin } from 'vue'

import MagicCookie from './src/components/MagicCookie.vue'
import { useMagicCookie } from './src/composables/useMagicCookie'

import type { CookieEvents } from './src/types/index'

const MagicCookiePlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicCookie', MagicCookie)
  },
}

export { MagicCookiePlugin, MagicCookie, useMagicCookie }
export type { CookieEvents }
