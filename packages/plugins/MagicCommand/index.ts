import MagicCommandDrawer from './src/components/MagicCommandDrawer.vue'
import MagicCommandItem from './src/components/MagicCommandItem.vue'
import MagicCommandModal from './src/components/MagicCommandModal.vue'
import MagicCommandProvider from './src/components/MagicCommandProvider.vue'
import MagicCommandView from './src/components/MagicCommandView.vue'
import MagicCommandRenderer from './src/components/MagicCommandRenderer.vue'
import MagicCommandContent from './src/components/MagicCommandContent.vue'
import MagicCommandTrigger from './src/components/MagicCommandTrigger.vue'

import {
  MagicModalProvider,
  MagicModalTeleport,
  MagicModalContent,
} from '@maas/vue-equipment/plugins/MagicModal'
import {
  MagicDrawerProvider,
  MagicDrawerTeleport,
  MagicDrawerContent,
} from '@maas/vue-equipment/plugins/MagicDrawer'

import { useMagicCommand } from './src/composables/useMagicCommand'
import {
  MagicCommandInstanceId,
  MagicCommandProviderOptions,
} from './src/symbols/index'

import type { App, Plugin } from 'vue'
import type {
  MagicCommandOptions,
  MagicCommandDrawerOptions,
  MagicCommandModalOptions,
} from './src/types/index'

const MagicCommandPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicCommandProvider', MagicCommandProvider)
    app.component('MagicCommandView', MagicCommandView)
    app.component('MagicCommandRenderer', MagicCommandRenderer)
    app.component('MagicCommandContent', MagicCommandContent)
    app.component('MagicCommandTrigger', MagicCommandTrigger)
    app.component('MagicCommandItem', MagicCommandItem)
    app.component('MagicCommandDrawer', MagicCommandDrawer)
    app.component('MagicCommandModal', MagicCommandModal)
    app.component('MagicModalProvider', MagicModalProvider)
    app.component('MagicModalTeleport', MagicModalTeleport)
    app.component('MagicModalContent', MagicModalContent)
    app.component('MagicDrawerProvider', MagicDrawerProvider)
    app.component('MagicDrawerTeleport', MagicDrawerTeleport)
    app.component('MagicDrawerContent', MagicDrawerContent)
  },
}

export {
  MagicCommandPlugin,
  useMagicCommand,
  MagicCommandInstanceId,
  MagicCommandProviderOptions,
  MagicModalProvider,
  MagicModalTeleport,
  MagicModalContent,
  MagicDrawerProvider,
  MagicDrawerTeleport,
  MagicDrawerContent,
}

export type {
  MagicCommandOptions,
  MagicCommandDrawerOptions,
  MagicCommandModalOptions,
}
