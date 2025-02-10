import MagicCookieItem from './src/components/MagicCookieItem.vue'
import MagicCookieView from './src/components/MagicCookieView.vue'
import MagicCookieProvider from './src/components/MagicCookieProvider.vue'

import { useMagicCookie } from './src/composables/useMagicCookie'

import type { App, Plugin } from 'vue'
import type { MagicCookieCallbackArgs, MagicCookieOptions } from './src/types'

const MagicCookiePlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicCookieView', MagicCookieView)
    app.component('MagicCookieProvider', MagicCookieProvider)
    app.component('MagicCookieItem', MagicCookieItem)
  },
}

export { MagicCookiePlugin, MagicCookieProvider, useMagicCookie }
export type { MagicCookieCallbackArgs, MagicCookieOptions }
