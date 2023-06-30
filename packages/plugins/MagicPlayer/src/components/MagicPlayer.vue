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
import { ref, provide, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useMediaApi } from './../composables/useMediaApi'
import { usePlayerApi } from './../composables/usePlayerApi'
import { useRuntimeSourceProvider } from './../composables/useRuntimeSourceProvider'
import { MediaApiInjectionKey, PlayerApiInjectionKey } from './../types'

import type { RuntimeSourceProvider } from './../types'

export type MagicPlayerProps = {
  provider: RuntimeSourceProvider
  src: string
  ratio?: string
  fill?: boolean
}

const props = withDefaults(defineProps<MagicPlayerProps>(), {
  provider: 'file',
  src: '',
  ratio: '16:9',
  fill: false,
})

const playerRef = ref<HTMLDivElement | undefined>(undefined)
const videoRef = ref<HTMLVideoElement | undefined>(undefined)

const mediaApi = useMediaApi(videoRef)
provide(MediaApiInjectionKey, mediaApi)

const playerApi = usePlayerApi(playerRef, videoRef, mediaApi)
provide(PlayerApiInjectionKey, playerApi)

const runtimeSourceProvider = useRuntimeSourceProvider(
  videoRef,
  props.provider,
  props.src
)

const { playing } = mediaApi
const { touched, pause } = playerApi
const { loaded } = runtimeSourceProvider

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
</script>

<style lang="postcss">
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
