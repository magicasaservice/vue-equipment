<template>
  <audio ref="el" class="magic-player-audio" />
</template>

<script lang="ts" setup>
import {
  toRefs,
  useTemplateRef,
  inject,
  watch,
  onMounted,
  onBeforeUnmount,
  shallowRef,
  computed,
} from 'vue'
import {
  useElementVisibility,
  useEventListener,
  defaultWindow,
} from '@vueuse/core'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { usePlayerAudioApi } from '../composables/private/usePlayerAudioApi'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { usePlayerRuntime } from '../composables/private/usePlayerRuntime'
import { usePlayerState } from '../composables/private/usePlayerState'

import { audioModePlaybackDefaults } from '../utils/playbackDefaults'

import {
  MagicPlayerInstanceId,
  MagicPlayerOptionsKey,
  MagicPlayerRef,
} from '../symbols'

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicPlayer',
  source: 'MagicPlayer',
})

const injectedInstanceId = inject(MagicPlayerInstanceId, undefined)
const injectedOptions = inject(MagicPlayerOptionsKey, undefined)
const injectedPlayerRef = inject(MagicPlayerRef, undefined)

magicError.assert(injectedInstanceId, {
  message: 'MagicPlayerAudio must be used within a MagicPlayerProvider',
  statusCode: 400,
})

magicError.assert(injectedOptions, {
  message: 'MagicPlayerAudio must be used within a MagicPlayerProvider',
  statusCode: 400,
})

const elRef = useTemplateRef('el')

const { initialize, destroy } = usePlayerRuntime({
  id: injectedInstanceId,
  mediaRef: elRef,
  src: injectedOptions.src,
  srcType: injectedOptions.srcType,
})

usePlayerMediaApi({
  id: injectedInstanceId,
  mediaRef: elRef,
})

const { play, pause } = usePlayerAudioApi({
  id: injectedInstanceId,
})

const { initializeState } = usePlayerState(injectedInstanceId)
const state = initializeState()
const { playing, started } = toRefs(state)

// Lifecycle hooks and listeners
const wasPlaying = shallowRef(false)
const isVisible = useElementVisibility(injectedPlayerRef)

const manageWindow = computed(() => {
  const playbackOptions = injectedOptions.playback || audioModePlaybackDefaults
  return playbackOptions !== false && playbackOptions?.includes('window')
})

const manageViewport = computed(() => {
  const playbackOptions = injectedOptions.playback || audioModePlaybackDefaults
  return playbackOptions !== false && playbackOptions?.includes('viewport')
})

function onWindowFocus() {
  if (isVisible.value && wasPlaying.value) {
    play()
  }
}

function onWindowBlur() {
  wasPlaying.value = playing.value
  pause()
}

if (manageWindow.value) {
  useEventListener(defaultWindow, 'focus', onWindowFocus)
  useEventListener(defaultWindow, 'blur', onWindowBlur)
}

if (manageViewport.value) {
  watch(isVisible, (value) => {
    if (!value) {
      wasPlaying.value = playing.value
      pause()
    }

    if (value && wasPlaying.value) {
      play()
    }

    if (value && injectedOptions.autoplay && !started.value) {
      play()
    }
  })
}

onMounted(() => {
  initialize()
})

onBeforeUnmount(() => {
  destroy()
})
</script>

<style>
.magic-player-audio {
  width: 100%;
}
</style>
