import { defineNuxtPlugin } from 'nuxt/app'
import { MagicModal } from './index'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MagicModal)
})
