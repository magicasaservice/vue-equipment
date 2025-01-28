import type { App, Plugin } from 'vue'

import MagicPlayerAudio from './src/components/MagicPlayerAudio.vue'
import MagicPlayerAudioControls from './src/components/MagicPlayerAudioControls.vue'
import MagicPlayerProvider from './src/components/MagicPlayerProvider.vue'
import MagicPlayerVideoControls from './src/components/MagicPlayerVideoControls.vue'
import MagicPlayerDisplayTime from './src/components/MagicPlayerDisplayTime.vue'
import MagicPlayerMuxPopover from './src/components/MagicPlayerMuxPopover.vue'
import MagicPlayerOverlay from './src/components/MagicPlayerOverlay.vue'
import MagicPlayerPoster from './src/components/MagicPlayerPoster.vue'
import MagicPlayerTimeline from './src/components/MagicPlayerTimeline.vue'
import MagicPlayerVideo from './src/components/MagicPlayerVideo.vue'
import { useMagicPlayer } from './src/composables/useMagicPlayer'

const MagicPlayerPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicPlayerAudio', MagicPlayerAudio)
    app.component('MagicPlayerAudioControls', MagicPlayerAudioControls)
    app.component('MagicPlayerProvider', MagicPlayerProvider)
    app.component('MagicPlayerVideoControls', MagicPlayerVideoControls)
    app.component('MagicPlayerDisplayTime', MagicPlayerDisplayTime)
    app.component('MagicPlayerMuxPopover', MagicPlayerMuxPopover)
    app.component('MagicPlayerOverlay', MagicPlayerOverlay)
    app.component('MagicPlayerPoster', MagicPlayerPoster)
    app.component('MagicPlayerTimeline', MagicPlayerTimeline)
    app.component('MagicPlayerVideo', MagicPlayerVideo)
  },
}

export { MagicPlayerPlugin, useMagicPlayer }
