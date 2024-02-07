import type { App, Plugin } from 'vue'

import MagicPlayer from './src/components/MagicPlayer.vue'
import MagicPlayerControls from './src/components/MagicPlayerControls.vue'
import MagicPlayerOverlay from './src/components/MagicPlayerOverlay.vue'
import MagicPlayerTimeline from './src/components/MagicPlayerTimeline.vue'
import MagicPlayerMuxPopover from './src/components/MagicPlayerMuxPopover.vue'

import { usePlayerApi } from './src/composables/usePlayerApi'

const MagicPlayerPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicPlayer', MagicPlayer)
    app.component('MagicPlayerControls', MagicPlayerControls)
    app.component('MagicPlayerOverlay', MagicPlayerOverlay)
    app.component('MagicPlayerTimeline', MagicPlayerTimeline)
    app.component('MagicPlayerMuxPopover', MagicPlayerMuxPopover)
  },
}

export {
  MagicPlayerPlugin,
  MagicPlayer,
  MagicPlayerControls,
  MagicPlayerOverlay,
  MagicPlayerTimeline,
  MagicPlayerMuxPopover,
  usePlayerApi,
}

export type * from './src/types/index'
