import { defineNuxtPlugin } from 'nuxt/app'
import { MagicScroll } from './index'

import { magicScrollEmit } from './src/utils'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MagicScroll)

  nuxtApp.provide('magicScroll', {
    emit: magicScrollEmit,
  })
})
