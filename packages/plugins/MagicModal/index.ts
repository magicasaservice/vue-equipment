import MagicModal from './src/components/MagicModal.vue'
import MagicModalProvider from './src/components/MagicModalProvider.vue'
import MagicModalTeleport from './src/components/MagicModalTeleport.vue'
import MagicModalBackdrop from './src/components/MagicModalBackdrop.vue'
import MagicModalContent from './src/components/MagicModalContent.vue'
import MagicModalTrigger from './src/components/MagicModalTrigger.vue'
import { useMagicModal } from './src/composables/useMagicModal'

import type { App, Plugin } from 'vue'
import type { MagicModalOptions, RequiredMagicModalOptions } from './src/types/index'

const MagicModalPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicModal', MagicModal)
    app.component('MagicModalProvider', MagicModalProvider)
    app.component('MagicModalTeleport', MagicModalTeleport)
    app.component('MagicModalBackdrop', MagicModalBackdrop)
    app.component('MagicModalContent', MagicModalContent)
    app.component('MagicModalTrigger', MagicModalTrigger)
  },
}

export {
  MagicModalPlugin,
  MagicModal,
  MagicModalProvider,
  MagicModalTeleport,
  MagicModalBackdrop,
  MagicModalContent,
  MagicModalTrigger,
  useMagicModal,
}
export type { MagicModalOptions, RequiredMagicModalOptions }
