import MagicScrollProvider from './src/components/MagicScrollProvider.vue'
import MagicScrollScene from './src/components/MagicScrollScene.vue'
import MagicScrollTransform from './src/components/MagicScrollTransform.vue'
import MagicScrollAnime from './src/components/MagicScrollAnime.vue'
import MagicScrollCollision from './src/components/MagicScrollCollision.vue'

import { magicScrollStore } from './src/store'
import { magicScrollEmit } from './src/utils'

import { useProgress } from './src/composables/useProgress'
import { useCollisionDetect } from './src/composables/useCollisionDetect'

import {
  EmitKey,
  StoreKey,
  UseCollisionDetectKey,
  UseProgressKey,
} from './src/types'

import type { App, Plugin } from 'vue'

export type * from './src/types'

const MagicScroll: Plugin = {
  install: (app: App) => {
    app.component('MagicScrollProvider', MagicScrollProvider)
    app.component('MagicScrollScene', MagicScrollScene)
    app.component('MagicScrollTransform', MagicScrollTransform)
    app.component('MagicScrollAnime', MagicScrollAnime)
    app.component('MagicScrollCollision', MagicScrollCollision)

    app.provide(EmitKey, magicScrollEmit)
    app.provide(StoreKey, magicScrollStore)

    app.provide(UseProgressKey, useProgress)
    app.provide(UseCollisionDetectKey, useCollisionDetect)
  },
}

export { MagicScroll }
