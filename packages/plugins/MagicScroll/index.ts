import MagicScrollProvider from './src/components/MagicScrollProvider.vue'
import MagicScrollScene from './src/components/MagicScrollScene.vue'
import MagicScrollMotion from './src/components/MagicScrollMotion.vue'
import MagicScrollCollision from './src/components/MagicScrollCollision.vue'

import {
  MagicScrollTarget,
  MagicScrollProgress,
  MagicScrollReturn,
} from './src/symbols/index'

import type { App, Plugin } from 'vue'
import type { MagicScrollSequence } from './src/types'

const MagicScrollPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicScrollProvider', MagicScrollProvider)
    app.component('MagicScrollScene', MagicScrollScene)
    app.component('MagicScrollMotion', MagicScrollMotion)
    app.component('MagicScrollCollision', MagicScrollCollision)
  },
}

export {
  MagicScrollPlugin,
  MagicScrollTarget,
  MagicScrollProgress,
  MagicScrollReturn,
}

export type { MagicScrollSequence }
