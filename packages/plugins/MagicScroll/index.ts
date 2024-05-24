import MagicScrollProvider from './src/components/MagicScrollProvider.vue'
import MagicScrollScene from './src/components/MagicScrollScene.vue'
import MagicScrollTransform from './src/components/MagicScrollTransform.vue'
import MagicScrollMotion from './src/components/MagicScrollMotion.vue'
import MagicScrollCollision from './src/components/MagicScrollCollision.vue'

import { useCollisionDetect } from './src/composables/private/useCollisionDetect'
import {
  MagicScrollParent,
  MagicScrollProgress,
  MagicScrollReturn,
} from './src/symbols/index'

import type { MagicScrollCollisionEntry } from './src/types/index'

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
  MagicScrollProvider,
  MagicScrollScene,
  MagicScrollTransform,
  MagicScrollMotion,
  MagicScrollCollision,
  useCollisionDetect,
  MagicScrollParent,
  MagicScrollProgress,
  MagicScrollReturn,
}

export type { MagicScrollCollisionEntry }
