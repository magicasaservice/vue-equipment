import { defineNuxtPlugin } from 'nuxt/app'
import { MagicScroll } from './index'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MagicScroll)
})
