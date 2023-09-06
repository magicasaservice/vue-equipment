import { defineNuxtPlugin } from 'nuxt/app'
import { MagicToast } from './index'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MagicToast)
})
