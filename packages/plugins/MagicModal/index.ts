import MagicModal from './src/components/MagicModal.vue'
import { useMagicModal } from './src/composables/useMagicModal'

import type { App, Plugin } from 'vue'
import type { ModalEvents, ModalOptions } from './src/types/index'

const MagicModalPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicModal', MagicModal)
  },
}

export { MagicModalPlugin, MagicModal, useMagicModal }
export type { ModalEvents, ModalOptions }
