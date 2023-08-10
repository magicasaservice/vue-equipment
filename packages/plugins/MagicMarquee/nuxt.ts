import { defineNuxtPlugin } from 'nuxt/app'
import { MagicMarquee } from './index'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MagicMarquee)
})
