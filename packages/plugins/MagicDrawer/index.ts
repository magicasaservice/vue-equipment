import MagicDrawer from './src/components/MagicDrawer.vue'
import { useMagicDrawer } from './src/composables/useMagicDrawer'

import type { App, Plugin } from 'vue'
import type { MagicDrawerEvents, MagicDrawerOptions } from './src/types/index'

const MagicDrawerPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicDrawer', MagicDrawer)
  },
}

export { MagicDrawerPlugin, MagicDrawer, useMagicDrawer }
export type { MagicDrawerEvents, MagicDrawerOptions }
