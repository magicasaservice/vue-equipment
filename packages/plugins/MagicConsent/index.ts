import type { App, Plugin } from 'vue'

import MagicConsent from './src/components/MagicConsent.vue'
import { useConsentApi } from './src/composables/useConsentApi'
import { useConsentEmitter } from './src/composables/useConsentEmitter'

const MagicConsentPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicConsent', MagicConsent)
  },
}

export { MagicConsentPlugin, MagicConsent, useConsentApi, useConsentEmitter }
