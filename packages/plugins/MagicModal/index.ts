import MagicModal from './src/components/MagicModal.vue'
import { useModalApi } from './src/composables/useModalApi'
import { useModalEmitter } from './src/composables/useModalEmitter'

import type { App, Plugin } from 'vue'

const MagicModalPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicModal', MagicModal)
  },
}

export { MagicModalPlugin, MagicModal, useModalEmitter, useModalApi }
