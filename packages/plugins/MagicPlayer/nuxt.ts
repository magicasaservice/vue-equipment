import MagicPlayerComponent from './src/components/MagicPlayer.vue'
import MagicPlayerControlsComponent from './src/components/MagicPlayerControls.vue'
import MagicPlayerTimelineComponent from './src/components/MagicPlayerTimeline.vue'

import { useMediaApi } from './src/composables/useMediaApi'
import { usePlayerApi } from './src/composables/usePlayerApi'
import { useRuntimeSourceProvider } from './src/composables/useRuntimeSourceProvider'

// @ts-ignore
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('MagicPlayer', MagicPlayerComponent)
  nuxtApp.vueApp.component('MagicPlayerControls', MagicPlayerControlsComponent)
  nuxtApp.vueApp.component('MagicPlayerTimeline', MagicPlayerTimelineComponent)
  nuxtApp.vueApp.provide('useMediaApi', useMediaApi)
  nuxtApp.vueApp.provide('usePlayerApi', usePlayerApi)
  nuxtApp.vueApp.provide('useRuntimeSourceProvider', useRuntimeSourceProvider)
})
