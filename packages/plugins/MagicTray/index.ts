import MagicTray from './src/components/MagicTray.vue'
import MagicTrayProvider from './src/components/MagicTrayProvider.vue'
import MagicTrayContent from './src/components/MagicTrayContent.vue'
import MagicTrayHandle from './src/components/MagicTrayHandle.vue'
import MagicTrayTransform from './src/components/MagicTrayTransform.vue'
import { useMagicTray } from './src/composables/useMagicTray'

import type { App, Plugin } from 'vue'
import type {
  MagicTrayOptions,
  MagicTraySide,
  MagicTraySidePayload,
  MagicTraySnapMode,
  MagicTrayDragMode,
  MagicTraySnapPoint,
  MagicTraySnapPointPayload,
  MagicTrayTransformAxis,
  MagicTrayWillSnapToPayload,
} from './src/types/index'

const MagicTrayPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicTray', MagicTray)
    app.component('MagicTrayProvider', MagicTrayProvider)
    app.component('MagicTrayContent', MagicTrayContent)
    app.component('MagicTrayHandle', MagicTrayHandle)
    app.component('MagicTrayTransform', MagicTrayTransform)
  },
}

export {
  MagicTrayPlugin,
  MagicTray,
  MagicTrayProvider,
  MagicTrayContent,
  MagicTrayHandle,
  MagicTrayTransform,
  useMagicTray,
}
export type {
  MagicTrayOptions,
  MagicTraySide,
  MagicTraySidePayload,
  MagicTraySnapMode,
  MagicTrayDragMode,
  MagicTraySnapPoint,
  MagicTraySnapPointPayload,
  MagicTrayWillSnapToPayload,
  MagicTrayTransformAxis,
}
