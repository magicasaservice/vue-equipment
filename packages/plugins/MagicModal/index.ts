import MagicModalComponent from './src/components/MagicModal.vue'
import { useModalApi } from './src/composables/useModalApi'
import type { App, Plugin } from 'vue'

const MagicModal: Plugin = {
  install: (app: App) => {
    app.component('MagicModal', MagicModalComponent)
    app.provide('useModalApi', useModalApi)
  },
}

export { MagicModal, useModalApi }
