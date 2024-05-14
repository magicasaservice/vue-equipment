import type { App, Plugin } from 'vue'

import MagicDraggable from './src/components/MagicDraggable.vue'

import type { MagicDraggableOptions } from './src/types'

const MagicDraggablePlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicDraggable', MagicDraggable)
  },
}

export { MagicDraggablePlugin, MagicDraggable }
export type { MagicDraggableOptions }
