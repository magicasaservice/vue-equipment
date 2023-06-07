<template>
  <div ref="playerRef" class="magic-player">
    <video
      ref="videoRef"
      class="magic-player-video"
      preload="auto"
      playsinline
    />
    <div v-show="!loaded || !touched" class="magic-player-poster"></div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import { useMediaApi } from './../composables/useMediaApi'
import { usePlayerApi } from './../composables/usePlayerApi'
import { useRuntimeSourceProvider } from './../composables/useRuntimeSourceProvider'
import {
  RuntimeSourceProvider,
  MediaApiInjectionKey,
  PlayerApiInjectionKey,
} from './../types'

export type MagicPlayerProps = {
  provider: RuntimeSourceProvider
  src: string
}

const props = withDefaults(defineProps<MagicPlayerProps>(), {
  provider: 'file',
  src: '',
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

const { touched } = playerApi
const { loaded } = runtimeSourceProvider
</script>

<style lang="postcss">
.magic-player {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.magic-player-video {
  position: absolute;
  inset: 0;
  object-fit: cover;
}

.magic-player-poster {
  position: absolute;
  inset: 0;
}
</style>
