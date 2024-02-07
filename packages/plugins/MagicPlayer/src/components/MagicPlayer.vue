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
    />
    <div v-show="!loaded || !touched" class="magic-player-poster">
      <slot name="poster" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { usePlayerApi } from '../composables/usePlayerApi'

import type { SourceType } from './../types'

export type MagicPlayerProps = {
  id: string
  srcType?: SourceType
  src: string
  ratio?: string
  fill?: boolean
  autoplay?: boolean
}

const props = withDefaults(defineProps<MagicPlayerProps>(), {
  srcType: 'native',
  src: '',
  ratio: '16:9',
  fill: false,
  autoplay: false,
})

const playerRef = ref<HTMLDivElement | undefined>(undefined)
const videoRef = ref<HTMLVideoElement | undefined>(undefined)

// Initialize instance
const { instance } = usePlayerApi({
  id: props.id,
  videoRef: videoRef,
  playerRef: playerRef,
  srcType: props.srcType,
  src: props.src,
})

const { playing, muted } = instance.value?.mediaApi
const { touched } = instance.value?.playerApi
const { onMouseenter, onMouseleave } = instance.value?.playerApi
const { loaded } = instance.value?.runtimeProvider

useIntersectionObserver(
  playerRef,
  ([{ isIntersecting }]) => {
    if (!isIntersecting && playing.value) {
      instance.value.playerApi.pause()
    } else if (isIntersecting && !playing.value && props.autoplay) {
      instance.value.playerApi.play()
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

.magic-player-poster {
  position: absolute;
  inset: 0;
}
</style>
