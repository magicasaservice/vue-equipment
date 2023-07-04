import { MagicModal } from './index'

// @ts-ignore
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MagicModal)
})
