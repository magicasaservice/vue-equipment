import { App, Plugin } from 'vue'

import MagicPlayerComponent from './src/components/MagicPlayer.vue'
import MagicPlayerControlsComponent from './src/components/MagicPlayerControls.vue'

export * from './src/types'

const MagicPlayer: Plugin = {
  install: (app: App) => {
    app.component('MagicPlayer', MagicPlayerComponent)
    app.component('MagicPlayerControls', MagicPlayerControlsComponent)
  },
}

export { MagicPlayer }
