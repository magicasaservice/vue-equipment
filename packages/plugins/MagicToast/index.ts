import MagicToast from './src/components/MagicToast.vue'
import { useToastApi } from './src/composables/useToastApi'
import { useToastEmitter } from './src/composables/useToastEmitter'

import type { App, Plugin } from 'vue'

const MagicToastPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicToast', MagicToast)
  },
}

export { MagicToastPlugin, MagicToast, useToastApi, useToastEmitter }
