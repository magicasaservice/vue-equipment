import { MagicPlayer } from './index'

// @ts-ignore
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MagicPlayer)
})