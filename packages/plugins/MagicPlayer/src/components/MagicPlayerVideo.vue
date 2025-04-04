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
} from 'vue'
import {
  useElementVisibility,
  useEventListener,
  defaultWindow,
} from '@vueuse/core'

import { usePlayerVideoApi } from '../composables/private/usePlayerVideoApi'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { usePlayerRuntime } from '../composables/private/usePlayerRuntime'
import { usePlayerState } from '../composables/private/usePlayerState'

import { MagicPlayerInstanceId, MagicPlayerOptionsKey } from '../symbols'
const injectedInstanceId = inject(MagicPlayerInstanceId, undefined)
const injectedOptions = inject(MagicPlayerOptionsKey, undefined)

if (!injectedInstanceId) {
  throw new Error('MagicPlayerVideo must be used within a MagicPlayerProvider')
}

if (!injectedOptions) {
  throw new Error('MagicPlayerVideo must be used within a MagicPlayerProvider')
}

const elRef = useTemplateRef('el')

const isVisible = useElementVisibility(elRef)

const { initialize, destroy } = usePlayerRuntime({
  id: injectedInstanceId,
  mediaRef: elRef,
  src: injectedOptions.src,
  srcType: injectedOptions.srcType,
})

const { initializeState } = usePlayerState(injectedInstanceId)
const state = initializeState()
const { muted, playing } = toRefs(state)

usePlayerMediaApi({
  id: injectedInstanceId,
  mediaRef: elRef,
})

const { play, pause } = usePlayerVideoApi({
  id: injectedInstanceId,
  videoRef: elRef,
})

function onWindowFocus() {
  if (isVisible.value && !playing.value && injectedOptions?.autoplay) {
    play()
  }
}

// Autoplay when window is focused
useEventListener(defaultWindow, 'focus', onWindowFocus)

// Autoplay when element is visible
watch(
  isVisible,
  (value) => {
    if (value && !playing.value && injectedOptions.autoplay) {
      play()
    } else if (!value && playing.value) {
      pause()
    }
  },
  {
    immediate: true,
  }
)

onMounted(() => {
  initialize()
  if (injectedOptions.autoplay) {
    muted.value = true
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
