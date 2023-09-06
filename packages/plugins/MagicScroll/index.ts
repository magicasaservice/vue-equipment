import MagicScrollProvider from './src/components/MagicScrollProvider.vue'
import MagicScrollScene from './src/components/MagicScrollScene.vue'
import MagicScrollTransform from './src/components/MagicScrollTransform.vue'
import MagicScrollMotion from './src/components/MagicScrollMotion.vue'
import MagicScrollCollision from './src/components/MagicScrollCollision.vue'

import { magicScrollStore } from './src/store'

import { useCollisionEmitter } from './src/composables/useCollisionEmitter'
import { useScrollApi } from './src/composables/useScrollApi'
import { useCollisionDetect } from './src/composables/useCollisionDetect'

import { StoreKey } from './src/types'

import type { App, Plugin } from 'vue'

export type * from './src/types'

const MagicScroll: Plugin = {
  install: (app: App) => {
    app.component('MagicScrollProvider', MagicScrollProvider)
    app.component('MagicScrollScene', MagicScrollScene)
    app.component('MagicScrollTransform', MagicScrollTransform)
    app.component('MagicScrollMotion', MagicScrollMotion)
    app.component('MagicScrollCollision', MagicScrollCollision)

    app.provide(StoreKey, magicScrollStore)
  },
}

export { MagicScroll, useCollisionEmitter, useScrollApi, useCollisionDetect }
