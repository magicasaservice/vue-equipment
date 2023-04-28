import { App, Plugin } from 'vue'
import mitt from 'mitt'

import MagicScrollProvider from './src/components/MagicScrollProvider.vue'
import MagicScrollScene from './src/components/MagicScrollScene.vue'
import MagicScrollTransform from './src/components/MagicScrollTransform.vue'
import MagicScrollAnime from './src/components/MagicScrollAnime.vue'
import MagicScrollCollision from './src/components/MagicScrollCollision.vue'

import { magicScrollStore } from './src/store'
import { collisionDetect } from './src/mixins/collision-detect'
import { CollisionEvents } from './src/types'

const emitter = mitt<CollisionEvents>()

export * from './src/types'
export { collisionDetect, magicScrollStore }

const MagicScroll: Plugin = {
  install: (app: App) => {
    app.component('MagicScrollProvider', MagicScrollProvider)
    app.component('MagicScrollScene', MagicScrollScene)
    app.component('MagicScrollTransform', MagicScrollTransform)
    app.component('MagicScrollAnime', MagicScrollAnime)
    app.component('MagicScrollCollision', MagicScrollCollision)

    app.provide('magicScrollEmit', {
      on: emitter.on,
      off: emitter.off,
      emit: emitter.emit,
    })
  },
}

export default MagicScroll

// export default defineNuxtPlugin((nuxtApp) => {
//   const router = useRouter()
//   nuxtApp.vueApp.component('MagicScrollProvider', MagicScrollProvider)
//   nuxtApp.vueApp.component('MagicScrollScene', MagicScrollScene)
//   nuxtApp.vueApp.component('MagicScrollTransform', MagicScrollTransform)
//   nuxtApp.vueApp.component('MagicScrollAnime', MagicScrollAnime)
//   nuxtApp.vueApp.component('MagicScrollCollision', MagicScrollCollision)

//   router.beforeEach(() => {
//     magicScrollStore.isNavigating = true
//   })

//   router.afterEach(() => {
//     setTimeout(() => (magicScrollStore.isNavigating = false), 150)
//   })

//   nuxtApp.provide('magicEmit', {
//     on: emitter.on,
//     off: emitter.off,
//     emit: emitter.emit,
//   })
// })
