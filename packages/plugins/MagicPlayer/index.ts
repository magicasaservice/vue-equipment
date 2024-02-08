import type { App, Plugin } from 'vue'

import MagicPlayer from './src/components/MagicPlayer.vue'
import MagicPlayerControls from './src/components/MagicPlayerControls.vue'
import MagicPlayerMuxPopover from './src/components/MagicPlayerMuxPopover.vue'
import MagicPlayerOverlay from './src/components/MagicPlayerOverlay.vue'
import MagicPlayerPoster from './src/components/MagicPlayerPoster.vue'
import MagicPlayerTimeline from './src/components/MagicPlayerTimeline.vue'
import { usePlayerApi } from './src/composables/usePlayerApi'

const MagicPlayerPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicPlayer', MagicPlayer)
    app.component('MagicPlayerControls', MagicPlayerControls)
    app.component('MagicPlayerMuxPopover', MagicPlayerMuxPopover)
    app.component('MagicPlayerOverlay', MagicPlayerOverlay)
    app.component('MagicPlayerPoster', MagicPlayerPoster)
    app.component('MagicPlayerTimeline', MagicPlayerTimeline)
  },
}

export {
  MagicPlayerPlugin,
  MagicPlayer,
  MagicPlayerControls,
  MagicPlayerMuxPopover,
  MagicPlayerPoster,
  MagicPlayerOverlay,
  MagicPlayerTimeline,
  usePlayerApi,
}

// export type * from './src/types/index'
