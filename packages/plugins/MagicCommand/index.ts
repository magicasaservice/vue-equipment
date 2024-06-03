import MagicCommandContent from './src/components/MagicCommandContent.vue'
import MagicCommandDrawer from './src/components/MagicCommandDrawer.vue'
import MagicCommandItem from './src/components/MagicCommandItem.vue'
import MagicCommandModal from './src/components/MagicCommandModal.vue'
import MagicCommandProvider from './src/components/MagicCommandProvider.vue'
import MagicCommandTrigger from './src/components/MagicCommandTrigger.vue'
import MagicCommandView from './src/components/MagicCommandView.vue'

import { useMagicCommand } from './src/composables/useMagicCommand'
import {
  MagicCommandInstanceId,
  MagicCommandProviderOptions,
} from './src/symbols/index'

import type { App, Plugin } from 'vue'

const MagicCommandPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicCommandContent', MagicCommandContent)
    app.component('MagicCommandDrawer', MagicCommandDrawer)
    app.component('MagicCommandItem', MagicCommandItem)
    app.component('MagicCommandModal', MagicCommandModal)
    app.component('MagicCommandProvider', MagicCommandProvider)
    app.component('MagicCommandTrigger', MagicCommandTrigger)
    app.component('MagicCommandView', MagicCommandView)
  },
}

export {
  MagicCommandPlugin,
  useMagicCommand,
  MagicCommandInstanceId,
  MagicCommandProviderOptions,
}
