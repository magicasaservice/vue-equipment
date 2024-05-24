import type { App, Plugin } from 'vue'

import MagicCookie from './src/components/MagicCookie.vue'
import { useMagicCookie } from './src/composables/useMagicCookie'

const MagicCookiePlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicCookie', MagicCookie)
  },
}

export { MagicCookiePlugin, MagicCookie, useMagicCookie }
