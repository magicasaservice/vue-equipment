import { App, Plugin } from 'vue'

import MagicPlayerComponent from './src/components/MagicPlayer.vue'
import MagicPlayerControlsComponent from './src/components/MagicPlayerControls.vue'
import MagicPlayerTimelineComponent from './src/components/MagicPlayerTimeline.vue'

export * from './src/types'

const MagicPlayer: Plugin = {
  install: (app: App) => {
    app.component('MagicPlayer', MagicPlayerComponent)
    app.component('MagicPlayerControls', MagicPlayerControlsComponent)
    app.component('MagicPlayerTimeline', MagicPlayerTimelineComponent)
  },
}

export { MagicPlayer }
