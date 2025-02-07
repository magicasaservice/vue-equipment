import type { App, Plugin } from 'vue'

import MagicCookieItem from './src/components/MagicCookieItem.vue'
import MagicCookieView from './src/components/MagicCookieView.vue'
import MagicCookieProvider from './src/components/MagicCookieProvider.vue'

import { useMagicCookie } from './src/composables/useMagicCookie'

import type { MagicCookieCallbackArgs } from './src/types'

const MagicCookiePlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicCookieView', MagicCookieView)
    app.component('MagicCookieProvider', MagicCookieProvider)
    app.component('MagicCookieItem', MagicCookieItem)
  },
}

export {
  MagicCookiePlugin,
  MagicCookieProvider,
  useMagicCookie,
  type MagicCookieCallbackArgs,
}
