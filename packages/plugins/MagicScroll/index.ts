import MagicScrollProvider from './src/components/MagicScrollProvider.vue'
import MagicScrollScene from './src/components/MagicScrollScene.vue'
import MagicScrollTransform from './src/components/MagicScrollTransform.vue'
import MagicScrollMotion from './src/components/MagicScrollMotion.vue'
import MagicScrollCollision from './src/components/MagicScrollCollision.vue'

import { useCollisionDetection } from './src/composables/private/useCollisionDetection'
import {
  MagicScrollParent,
  MagicScrollProgress,
  MagicScrollReturn,
} from './src/symbols/index'

import type { App, Plugin } from 'vue'

const MagicScrollPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicScrollProvider', MagicScrollProvider)
    app.component('MagicScrollScene', MagicScrollScene)
    app.component('MagicScrollTransform', MagicScrollTransform)
    app.component('MagicScrollMotion', MagicScrollMotion)
    app.component('MagicScrollCollision', MagicScrollCollision)
  },
}

export {
  MagicScrollPlugin,
  useCollisionDetection,
  MagicScrollParent,
  MagicScrollProgress,
  MagicScrollReturn,
}
