<template>
  <video
    ref="el"
    class="magic-player-video"
    playsinline
    disablePictureInPicture
    :preload="injectedOptions.preload"
    :loop="injectedOptions.loop"
    :muted="muted"
  />
</template>

<script lang="ts" setup>
import {
  toRefs,
  useTemplateRef,
  watch,
  onMounted,
  inject,
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

import { usePlayerVideoApi } from '../composables/private/usePlayerVideoApi'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { usePlayerRuntime } from '../composables/private/usePlayerRuntime'
import { usePlayerState } from '../composables/private/usePlayerState'

import { videoModePlaybackDefaults } from '../utils/playbackDefaults'

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
  message: 'MagicPlayerVideo must be used within a MagicPlayerProvider',
  errorCode: 'missing_instance_id',
})

magicError.assert(injectedOptions, {
  message: 'MagicPlayerVideo must be used within a MagicPlayerProvider',
  errorCode: 'missing_options',
})

const elRef = useTemplateRef('el')

const { initialize, destroy } = usePlayerRuntime({
  id: injectedInstanceId,
  mediaRef: elRef,
  src: injectedOptions.src,
  srcType: injectedOptions.srcType,
  debug: injectedOptions.debug,
})

const { initializeState } = usePlayerState(injectedInstanceId)
const state = initializeState()
const { muted, playing, started, loaded } = toRefs(state)

usePlayerMediaApi({
  id: injectedInstanceId,
  mediaRef: elRef,
})

const { play, pause, mute, initializeFullscreen } = usePlayerVideoApi({
  id: injectedInstanceId,
  videoRef: elRef,
  playerRef: injectedPlayerRef,
})

// Lifecycle hooks and listeners
const wasPlaying = shallowRef(false)
const isVisible = useElementVisibility(elRef)

const manageWindow = computed(() => {
  const playbackOptions = injectedOptions.playback || videoModePlaybackDefaults
  return playbackOptions !== false && playbackOptions?.includes('window')
})

const manageViewport = computed(() => {
  const playbackOptions = injectedOptions.playback || videoModePlaybackDefaults
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

// If viewport is managed, autoplay when the video
// has loaded, is visible and autoplay is enabled
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

  watch(
    loaded,
    (value) => {
      if (
        value &&
        !started.value &&
        isVisible.value &&
        injectedOptions.autoplay
      ) {
        play()
      }
    },
    { once: true }
  )
}

// If viewport is not managed, autoplay when the video
// has loaded and autoplay is enabled
if (!manageViewport.value) {
  watch(
    loaded,
    (value) => {
      if (value && !started.value && injectedOptions.autoplay) {
        play()
      }
    },
    { once: true }
  )
}

onMounted(async () => {
  initialize(injectedOptions.autoplay)
  initializeFullscreen()

  if (injectedOptions.autoplay) {
    mute()
  }
})

onBeforeUnmount(() => {
  destroy()
})
</script>

<style>
.magic-player-video {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  object-fit: cover;
}
</style>
