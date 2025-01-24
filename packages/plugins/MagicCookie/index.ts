import type { App, Plugin } from 'vue'

import MagicCookieActions from './src/components/MagicCookieActions.vue'
import MagicCookieButton from './src/components/MagicCookieButton.vue'
import MagicCookieCheckbox from './src/components/MagicCookieCheckbox.vue'
import MagicCookiePreferences from './src/components/MagicCookiePreferences.vue'
import MagicCookieProvider from './src/components/MagicCookieProvider.vue'

import { useMagicCookie } from './src/composables/useMagicCookie'

import type { MagicCookie, MagicCookieCallbackArgs } from './src/types'

const MagicCookiePlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicCookieActions', MagicCookieActions)
    app.component('MagicCookieButton', MagicCookieButton)
    app.component('MagicCookieCheckbox', MagicCookieCheckbox)
    app.component('MagicCookiePreferences', MagicCookiePreferences)
    app.component('MagicCookieProvider', MagicCookieProvider)
  },
}

export {
  MagicCookiePlugin,
  MagicCookieProvider,
  useMagicCookie,
  type MagicCookie,
  type MagicCookieCallbackArgs,
}
