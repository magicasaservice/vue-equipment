import MagicModalComponent from './src/components/MagicModal.vue'
import { useModalApi } from './src/composables/useModalApi'

// @ts-ignore
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('MagicModal', MagicModalComponent)
  nuxtApp.vueApp.provide('useModalApi', useModalApi)
})
