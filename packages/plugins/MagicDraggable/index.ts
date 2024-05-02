import type { App, Plugin } from 'vue'

import MagicDraggable from './src/components/MagicDraggable.vue'
import { useDraggableApi } from './src/composables/useDraggableApi'

const MagicDraggablePlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicDraggable', MagicDraggable)
  },
}

export { MagicDraggablePlugin, MagicDraggable, useDraggableApi }