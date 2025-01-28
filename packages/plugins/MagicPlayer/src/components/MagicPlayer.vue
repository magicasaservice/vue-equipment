<template>
  <div
    ref="playerRef"
    class="magic-player"
    :data-fullscreen="isFullscreen"
    :data-touched="touched"
    :data-playing="playing"
    :data-paused="!playing"
    :data-waiting="waiting"
    :data-loaded="loaded"
    :data-muted="muted"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <video
      ref="videoRef"
      class="magic-player__video"
      playsinline
      disablePictureInPicture
      :preload="mappedOptions.preload"
      :loop="mappedOptions.loop"
      :muted="muted"
    />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount, provide } from 'vue'
import {
  useElementVisibility,
  useEventListener,
  defaultWindow,
} from '@vueuse/core'
import defu from 'defu'

import { usePlayerVideoApi } from '../composables/private/usePlayerVideoApi'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { usePlayerRuntime } from '../composables/private/usePlayerRuntime'

import { MagicPlayerInstanceId } from '../symbols'
import { defaultOptions } from '../utils/defaultOptions'

import type { MagicPlayerOptions } from './../types'

interface MagicPlayerProps {
  id: string
  src: string
  options?: MagicPlayerOptions
}

const { id, src, options } = defineProps<MagicPlayerProps>()

const mappedOptions = defu(options, defaultOptions)

const playerRef = ref<HTMLDivElement | undefined>(undefined)
const videoRef = ref<HTMLVideoElement | undefined>(undefined)

const isVisible = useElementVisibility(playerRef)

const { playing, waiting, muted } = usePlayerMediaApi({
  id: id,
  mediaRef: videoRef,
})

const { initialize, loaded, destroy } = usePlayerRuntime({
  id: id,
  mediaRef: videoRef,
  src: src,
  srcType: mappedOptions.srcType,
})

const { onMouseenter, onMouseleave, isFullscreen, touched, play, pause } =
  usePlayerVideoApi({
    id: id,
    videoRef: videoRef,
    playerRef: playerRef,
  })

function onWindowFocus() {
  if (isVisible.value && !playing.value && mappedOptions.autoplay) {
    play()
  }
}

// Autoplay when window is focused
useEventListener(defaultWindow, 'focus', onWindowFocus)

// Autoplay when element is visible
watch(
  isVisible,
  (value) => {
    if (value && !playing.value && mappedOptions.autoplay) {
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
  if (mappedOptions.autoplay) {
    muted.value = true
  }
})

onBeforeUnmount(() => {
  destroy()
})

provide(MagicPlayerInstanceId, id)
</script>

<style>
.magic-player {
  position: relative;
  width: 100%;
  overflow: hidden;
  height: var(--magic-player-height, auto);
  aspect-ratio: var(--magic-player-aspect-ratio, 16 / 9);
  background: var(--magic-player-background, #000);
}

.magic-player[data-loaded='true'] {
  --magic-player-background: transparent;
}

.magic-player__video {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  object-fit: cover;
}
</style>
