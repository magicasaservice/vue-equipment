import MagicCommandDrawer from './src/components/MagicCommandDrawer.vue'
import MagicCommandItem from './src/components/MagicCommandItem.vue'
import MagicCommandModal from './src/components/MagicCommandModal.vue'
import MagicCommandProvider from './src/components/MagicCommandProvider.vue'
import MagicCommandView from './src/components/MagicCommandView.vue'
import MagicCommandRenderer from './src/components/MagicCommandRenderer.vue'
import MagicCommandContent from './src/components/MagicCommandContent.vue'
import MagicCommandTrigger from './src/components/MagicCommandTrigger.vue'

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
  },
}

export {
  MagicCommandPlugin,
  useMagicCommand,
  MagicCommandInstanceId,
  MagicCommandProviderOptions,
}

export type {
  MagicCommandOptions,
  MagicCommandDrawerOptions,
  MagicCommandModalOptions,
}
