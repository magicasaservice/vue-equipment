import MagicDrawer from './src/components/MagicDrawer.vue'
import { useDrawerApi } from './src/composables/useDrawerApi'
import { useDrawerEmitter } from './src/composables/useDrawerEmitter'

import type { App, Plugin } from 'vue'

const MagicDrawerPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicDrawer', MagicDrawer)
  },
}

export { MagicDrawerPlugin, MagicDrawer, useDrawerApi, useDrawerEmitter }