import MagicDrawer from './src/components/MagicDrawer.vue'
import MagicDrawerProvider from './src/components/MagicDrawerProvider.vue'
import MagicDrawerTeleport from './src/components/MagicDrawerTeleport.vue'
import MagicDrawerBackdrop from './src/components/MagicDrawerBackdrop.vue'
import MagicDrawerContent from './src/components/MagicDrawerContent.vue'
import MagicDrawerTrigger from './src/components/MagicDrawerTrigger.vue'
import { useMagicDrawer } from './src/composables/useMagicDrawer'

import type { App, Plugin } from 'vue'
import type {
  MagicDrawerOptions,
  MagicDrawerSnapPoint,
  MagicDrawerWillSnapToPayload,
} from './src/types/index'

const MagicDrawerPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicDrawer', MagicDrawer)
    app.component('MagicDrawerProvider', MagicDrawerProvider)
    app.component('MagicDrawerTeleport', MagicDrawerTeleport)
    app.component('MagicDrawerBackdrop', MagicDrawerBackdrop)
    app.component('MagicDrawerContent', MagicDrawerContent)
    app.component('MagicDrawerTrigger', MagicDrawerTrigger)
  },
}

export {
  MagicDrawerPlugin,
  MagicDrawer,
  MagicDrawerProvider,
  MagicDrawerTeleport,
  MagicDrawerBackdrop,
  MagicDrawerContent,
  MagicDrawerTrigger,
  useMagicDrawer,
}
export type {
  MagicDrawerOptions,
  MagicDrawerSnapPoint,
  MagicDrawerWillSnapToPayload,
}
