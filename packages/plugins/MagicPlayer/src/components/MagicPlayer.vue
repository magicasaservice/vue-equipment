<template>
  <div
    ref="playerRef"
    class="magic-player"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <video
      ref="videoRef"
      class="magic-player__video"
      playsinline
      disablePictureInPicture
      :preload="preload"
      :loop="loop"
      :muted="muted"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  useElementVisibility,
  useEventListener,
  defaultWindow,
} from '@vueuse/core'
import { usePlayerVideoApi } from '../composables/private/usePlayerVideoApi'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { usePlayerRuntime } from '../composables/private/usePlayerRuntime'

import type { MagicPlayerSourceType } from './../types'

interface MagicPlayerProps {
  id: string
  srcType?: MagicPlayerSourceType
  src: string
  autoplay?: boolean
  preload?: 'auto' | 'metadata' | 'none'
  loop?: boolean
}

const props = withDefaults(defineProps<MagicPlayerProps>(), {
  srcType: 'native',
  src: '',
  autoplay: false,
  preload: 'metadata',
  loop: false,
})

const playerRef = ref<HTMLDivElement | undefined>(undefined)
const videoRef = ref<HTMLVideoElement | undefined>(undefined)

const isVisible = useElementVisibility(playerRef)

const { playing, muted } = usePlayerMediaApi({
  id: props.id,
  mediaRef: videoRef,
})

const { initialize, destroy } = usePlayerRuntime({
  id: props.id,
  mediaRef: videoRef,
  src: props.src,
  srcType: props.srcType,
})

const { onMouseenter, onMouseleave, play, pause } = usePlayerVideoApi({
  id: props.id,
  videoRef: videoRef,
  playerRef: playerRef,
})

function onWindowFocus() {
  if (isVisible.value && !playing.value && props.autoplay) {
    play()
  }
}

// Auto play when window is focused
useEventListener(defaultWindow, 'focus', onWindowFocus)

// Auto play when element is visible
watch(
  isVisible,
  (value) => {
    if (value && !playing.value && props.autoplay) {
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
  if (props.autoplay) {
    muted.value = true
  }
})

onBeforeUnmount(() => {
  destroy()
})
</script>

<style lang="css">
.magic-player {
  position: relative;
  width: 100%;
  overflow: hidden;
  height: var(--magic-player-height, auto);
  aspect-ratio: var(--magic-player-aspect-ratio, 16 / 9);
  background: var(--magic-player-background, #000);
}

.magic-player__video {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  object-fit: cover;
}
</style>
