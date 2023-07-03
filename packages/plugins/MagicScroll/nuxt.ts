import MagicScrollProvider from './src/components/MagicScrollProvider.vue'
import MagicScrollScene from './src/components/MagicScrollScene.vue'
import MagicScrollTransform from './src/components/MagicScrollTransform.vue'
import MagicScrollAnime from './src/components/MagicScrollAnime.vue'
import MagicScrollCollision from './src/components/MagicScrollCollision.vue'

import { magicScrollStore } from './src/store'
import { magicScrollEmit } from './src/utils'

import { useProgress } from './src/composables/useProgress'
import { useCollisionDetect } from './src/composables/useCollisionDetect'

// @ts-ignore
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('MagicScrollProvider', MagicScrollProvider)
  nuxtApp.vueApp.component('MagicScrollScene', MagicScrollScene)
  nuxtApp.vueApp.component('MagicScrollTransform', MagicScrollTransform)
  nuxtApp.vueApp.component('MagicScrollAnime', MagicScrollAnime)
  nuxtApp.vueApp.component('MagicScrollCollision', MagicScrollCollision)

  nuxtApp.vueApp.provide('magicScrollEmit', magicScrollEmit)
  nuxtApp.vueApp.provide('magicScrollStore', magicScrollStore)

  nuxtApp.vueApp.provide('useProgress', useProgress)
  nuxtApp.vueApp.provide('useCollisionDetect', useCollisionDetect)
})
