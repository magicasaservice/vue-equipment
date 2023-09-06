import MagicToastComponent from './src/components/MagicToast.vue'
import { useToastApi } from './src/composables/useToastApi'
import { useToastEmitter } from './src/composables/useToastEmitter'

import type { App, Plugin } from 'vue'

const MagicToast: Plugin = {
  install: (app: App) => {
    app.component('MagicToast', MagicToastComponent)
  },
}

export { MagicToast, useToastApi, useToastEmitter }
