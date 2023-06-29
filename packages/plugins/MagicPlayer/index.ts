import { App, Plugin } from 'vue'

import MagicPlayerComponent from './src/components/MagicPlayer.vue'
import MagicPlayerControlsComponent from './src/components/MagicPlayerControls.vue'
import MagicPlayerTimelineComponent from './src/components/MagicPlayerTimeline.vue'

import { useMediaApi } from './src/composables/useMediaApi'
import { usePlayerApi } from './src/composables/usePlayerApi'
import { useRuntimeSourceProvider } from './src/composables/useRuntimeSourceProvider'

export * from './src/types'

const MagicPlayer: Plugin = {
  install: (app: App) => {
    app.component('MagicPlayer', MagicPlayerComponent)
    app.component('MagicPlayerControls', MagicPlayerControlsComponent)
    app.component('MagicPlayerTimeline', MagicPlayerTimelineComponent)
    app.provide('useMediaApi', useMediaApi)
    app.provide('usePlayerApi', usePlayerApi)
    app.provide('useRuntimeSourceProvider', useRuntimeSourceProvider)
  },
}

export { MagicPlayer }
