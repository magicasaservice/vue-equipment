<template>
  <div class="magic-player">
    <video ref="video" class="magic-player__video" preload="auto" playsinline />
    <div v-if="!loaded || !touched" class="magic-player__poster"></div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, watch } from 'vue'
import { useMediaApi } from './../composables/useMediaApi'
import { useRuntimeSourceProvider } from './../composables/useRuntimeSourceProvider'
import { RuntimeSourceProvider, MediaApiInjectionKey } from './../types'

export type MagicPlayerProps = {
  provider: RuntimeSourceProvider
  src: string
}

const props = withDefaults(defineProps<MagicPlayerProps>(), {
  provider: 'file',
  src: '',
})

const video = ref<HTMLVideoElement | undefined>(undefined)

const touched = ref(false)

const mediaApi = useMediaApi(video)
provide(MediaApiInjectionKey, mediaApi)

const sourceProvider = useRuntimeSourceProvider(
  video,
  props.provider,
  props.src
)

const { playing } = mediaApi
const { loaded } = sourceProvider

watch(playing, () => {
  if (!touched.value) {
    touched.value = true
  }
})
</script>

<style lang="postcss">
.magic-player {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: white;
}

.magic-player__video {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
}

.magic-player__poster {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
