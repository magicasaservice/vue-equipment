<template>
  <div
    ref="playerRef"
    class="magic-player"
    :style="computedStyle"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <video
      ref="videoRef"
      class="magic-player-video"
      preload="auto"
      playsinline
      disablePictureInPicture
      :loop="props.loop"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { usePlayerVideoApi } from '../composables/private/usePlayerVideoApi'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { usePlayerRuntime } from '../composables/private/usePlayerRuntime'

import type { SourceType } from './../types'

interface Props {
  id: string
  srcType?: SourceType
  src: string
  ratio?: string
  fill?: boolean
  autoplay?: boolean
  loop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  srcType: 'native',
  src: '',
  ratio: '16:9',
  fill: false,
  autoplay: false,
  loop: false,
})

const playerRef = ref<HTMLDivElement | undefined>(undefined)
const videoRef = ref<HTMLVideoElement | undefined>(undefined)

const { playing, muted } = usePlayerMediaApi({
  id: props.id,
  mediaRef: videoRef,
})

usePlayerRuntime({
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

useIntersectionObserver(
  playerRef,
  ([{ isIntersecting }]) => {
    if (!isIntersecting && playing.value) {
      pause()
    } else if (isIntersecting && !playing.value && props.autoplay) {
      play()
    }
  },
  {
    immediate: true,
  }
)

const computedRatio = computed(() => {
  if (props.ratio) {
    return props.ratio.split(':')
  } else {
    return undefined
  }
})

const computedStyle = computed(() => {
  return {
    height: props.fill ? '100%' : undefined,
    'aspect-ratio':
      computedRatio.value && !props.fill
        ? `${computedRatio.value[0]}/${computedRatio.value[1]}`
        : undefined,
  }
})

onMounted(() => {
  if (props.autoplay) {
    muted.value = true
  }
})
</script>

<style lang="css">
:root {
  --magic-player-aspect-ratio: 16 / 9;
}

.magic-player {
  position: relative;
  width: 100%;
  overflow: hidden;
  aspect-ratio: var(--magic-player-aspect-ratio);
}

.magic-player-video {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
}
</style>
