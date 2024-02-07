import type { App, Plugin } from 'vue'

import MagicCookie from './src/components/MagicCookie.vue'
import { useCookieApi } from './src/composables/useCookieApi'
import { useCookieEmitter } from './src/composables/useCookieEmitter'

import type { CookieEvents } from './src/types/index'

const MagicCookiePlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicCookie', MagicCookie)
  },
}

export { MagicCookiePlugin, MagicCookie, useCookieApi, useCookieEmitter }
export type { CookieEvents }
