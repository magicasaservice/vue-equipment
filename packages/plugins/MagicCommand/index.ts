import MagicCommandBody from './src/components/MagicCommandBody.vue'
import MagicCommandDrawer from './src/components/MagicCommandDrawer.vue'
import MagicCommandFooter from './src/components/MagicCommandFooter.vue'
import MagicCommandGroup from './src/components/MagicCommandGroup.vue'
import MagicCommandHead from './src/components/MagicCommandHead.vue'
import MagicCommandItem from './src/components/MagicCommandItem.vue'
import MagicCommandModal from './src/components/MagicCommandModal.vue'
import MagicCommandProvider from './src/components/MagicCommandProvider.vue'
import MagicCommandView from './src/components/MagicCommandView.vue'

import { useMagicCommand } from './src/composables/useMagicCommand'
import {
  MagicCommandInstanceId,
  MagicCommandOptions,
} from './src/symbols/index'

import type { App, Plugin } from 'vue'
import type { MagicCommandEvents } from './src/types/index'

const MagicCommandPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicCommandBody', MagicCommandBody)
    app.component('MagicCommandDrawer', MagicCommandDrawer)
    app.component('MagicCommandFooter', MagicCommandFooter)
    app.component('MagicCommandGroup', MagicCommandGroup)
    app.component('MagicCommandHead', MagicCommandHead)
    app.component('MagicCommandItem', MagicCommandItem)
    app.component('MagicCommandModal', MagicCommandModal)
    app.component('MagicCommandProvider', MagicCommandProvider)
    app.component('MagicCommandView', MagicCommandView)
  },
}

export {
  MagicCommandPlugin,
  useMagicCommand,
  MagicCommandInstanceId,
  MagicCommandOptions,
}
export type { MagicCommandEvents }
