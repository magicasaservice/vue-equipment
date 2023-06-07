import { App, Plugin } from 'vue'
import MagicModalComponent from './src/components/MagicModal.vue'
import { useModalApi } from './src/composables/useModalApi'

// export * from './src/types'

const MagicModal: Plugin = {
  install: (app: App) => {
    app.component('MagicModal', MagicModalComponent)
  },
}

export { MagicModal, useModalApi }
