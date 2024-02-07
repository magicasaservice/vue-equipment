import MagicScrollProvider from './src/components/MagicScrollProvider.vue'
import MagicScrollScene from './src/components/MagicScrollScene.vue'
import MagicScrollTransform from './src/components/MagicScrollTransform.vue'
import MagicScrollMotion from './src/components/MagicScrollMotion.vue'
import MagicScrollCollision from './src/components/MagicScrollCollision.vue'

import { useCollisionEmitter } from './src/composables/useCollisionEmitter'
import { useScrollApi } from './src/composables/useScrollApi'
import { useCollisionDetect } from './src/composables/useCollisionDetect'
import {
  ScrollParentKey,
  ScrollPositionKey,
  ScrollProgressKey,
} from './src/symbols'

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
  useCollisionEmitter,
  useScrollApi,
  useCollisionDetect,
  ScrollParentKey,
  ScrollPositionKey,
  ScrollProgressKey,
}

export * from './src/symbols'
export type * from './src/types/index'
