import type { App, Plugin } from 'vue'

import MagicPlayer from './src/components/MagicPlayer.vue'
import MagicPlayerControls from './src/components/MagicPlayerControls.vue'
import MagicPlayerTimeline from './src/components/MagicPlayerTimeline.vue'
import MagicPlayerMuxPopover from './src/components/MagicPlayerMuxPopover.vue'

import { useMediaApi } from './src/composables/useMediaApi'
import { usePlayerApi } from './src/composables/usePlayerApi'
import { useProvidePlayer, useInjectPlayer } from './src/composables/usePlayer'
import {
  useProvideControls,
  useInjectControls,
} from './src/composables/useControls'
import { useRuntimeSourceProvider } from './src/composables/useRuntimeSourceProvider'
import {
  MediaApiInjectionKey,
  PlayerApiInjectionKey,
  RuntimeSourceProviderInjectionKey,
  ControlsApiInjectionKey,
} from './src/symbols'

const MagicPlayerPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicPlayer', MagicPlayer)
    app.component('MagicPlayerControls', MagicPlayerControls)
    app.component('MagicPlayerTimeline', MagicPlayerTimeline)
    app.component('MagicPlayerMuxPopover', MagicPlayerMuxPopover)
  },
}

export {
  MagicPlayerPlugin,
  MagicPlayer,
  MagicPlayerControls,
  MagicPlayerTimeline,
  MagicPlayerMuxPopover,
  useMediaApi,
  usePlayerApi,
  useRuntimeSourceProvider,
  useProvidePlayer,
  useInjectPlayer,
  useProvideControls,
  useInjectControls,
  MediaApiInjectionKey,
  PlayerApiInjectionKey,
  RuntimeSourceProviderInjectionKey,
  ControlsApiInjectionKey,
}

export * from './src/symbols'
export type * from './src/types'
