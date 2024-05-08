import MagicToast from './src/components/MagicToast.vue'
import { useMagicToast } from './src/composables/useMagicToast'

import type { App, Plugin } from 'vue'
import type { ToastEvents } from './src/types/index'

const MagicToastPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicToast', MagicToast)
  },
}

export { MagicToastPlugin, MagicToast, useMagicToast }
export type { ToastEvents }
