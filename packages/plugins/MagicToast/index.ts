import MagicToast from './src/components/MagicToast.vue'
import { useToastApi } from './src/composables/useToastApi'
import { useToastEmitter } from './src/composables/useToastEmitter'

import type { App, Plugin } from 'vue'
import type { ToastEvents } from './src/types/index'

const MagicToastPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicToast', MagicToast)
  },
}

export { MagicToastPlugin, MagicToast, useToastApi, useToastEmitter }
export type { ToastEvents }
