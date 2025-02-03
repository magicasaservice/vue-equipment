import MagicToastProvider from './src/components/MagicToastProvider.vue'
import { useMagicToast } from './src/composables/useMagicToast'

import type { App, Plugin } from 'vue'

const MagicToastPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicToastProvider', MagicToastProvider)
  },
}

export { MagicToastPlugin, useMagicToast }
