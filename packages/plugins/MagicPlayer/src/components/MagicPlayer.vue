<template>
  <div ref="playerRef" class="magic-player" :style="computedStyle">
    <video
      ref="videoRef"
      class="magic-player-video"
      preload="auto"
      playsinline
    />
    <div v-show="!loaded || !touched" class="magic-player-poster">
      <slot name="poster" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useProvidePlayer } from '../composables/usePlayer'

import type { SourceType } from './../types'

export type MagicPlayerProps = {
  srcType?: SourceType
  src: string
  ratio?: string
  fill?: boolean
}

const props = withDefaults(defineProps<MagicPlayerProps>(), {
  srcType: 'native',
  src: '',
  ratio: '16:9',
  fill: false,
})

const playerRef = ref<HTMLDivElement | undefined>(undefined)
const videoRef = ref<HTMLVideoElement | undefined>(undefined)

const { mediaApi, playerApi, runtimeProvider } = useProvidePlayer({
  playerRef: playerRef,
  videoRef: videoRef,
  src: props.src,
  srcType: props.srcType,
})
const { playing } = mediaApi
const { touched, pause } = playerApi
const { loaded } = runtimeProvider

useIntersectionObserver(playerRef, ([{ isIntersecting }]) => {
  if (!isIntersecting && playing.value) {
    pause()
  }
})

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

defineExpose({
  playerApi,
  mediaApi,
  runtimeProvider,
})
</script>

<style lang="css">
.magic-player {
  --aspect-ratio: 16 / 9;
  position: relative;
  width: 100%;
  overflow: hidden;
  aspect-ratio: var(--aspect-ratio);
}

.magic-player-video {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
}

.magic-player-poster {
  position: absolute;
  inset: 0;
}
</style>
