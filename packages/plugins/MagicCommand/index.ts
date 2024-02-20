import MagicCommand from './src/components/MagicCommand.vue'
import MagicCommandBody from './src/components/MagicCommandBody.vue'
import MagicCommandFooter from './src/components/MagicCommandFooter.vue'
import MagicCommandGroup from './src/components/MagicCommandGroup.vue'
import MagicCommandHead from './src/components/MagicCommandHead.vue'
import MagicCommandInput from './src/components/MagicCommandInput.vue'
import MagicCommandItem from './src/components/MagicCommandItem.vue'
import MagicCommandView from './src/components/MagicCommandView.vue'

import { useCommandApi } from './src/composables/useCommandApi'
import { useCommandEmitter } from './src/composables/useCommandEmitter'

import type { App, Plugin } from 'vue'
import type { CommandEvents } from './src/types/index'

const MagicCommandPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicCommand', MagicCommand)
    app.component('MagicCommandBody', MagicCommandBody)
    app.component('MagicCommandFooter', MagicCommandFooter)
    app.component('MagicCommandGroup', MagicCommandGroup)
    app.component('MagicCommandHead', MagicCommandHead)
    app.component('MagicCommandInput', MagicCommandInput)
    app.component('MagicCommandItem', MagicCommandItem)
    app.component('MagicCommandView', MagicCommandView)
  },
}

export { MagicCommandPlugin, useCommandApi, useCommandEmitter }
export type { CommandEvents }
