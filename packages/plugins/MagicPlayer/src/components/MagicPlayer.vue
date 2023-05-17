<template>
  <div ref="player" class="player">
    <div class="player-media" @click="togglePlay">
      <video ref="video" class="player-video" preload="auto" playsinline />
      <img
        v-show="showThumbnail"
        ref="thumbnail"
        class="player-thumbnail"
        :src="thumbnailSrc"
      />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, provide } from 'vue'
import { useMediaApi } from './../composables/useMediaApi'
import { mediaApiInjectionKey } from './../types'
import Hls from 'hls.js'

const props = defineProps({
  playbackId: {
    type: String,
    default: '',
  },
  thumbnailTime: {
    type: [Number, String],
    default: undefined,
  },
})

// Refs
const player = ref<HTMLDivElement | undefined>(undefined)
const video = ref<HTMLVideoElement | undefined>(undefined)

// API
const mediaApi = useMediaApi(video)
provide(mediaApiInjectionKey, mediaApi)

// State
const loaded = ref(false)
const { currentTime, ended, togglePlay } = mediaApi

// Hls
const hls = ref<Hls | null>(null)

// Computed
const src = computed(() => `https://stream.mux.com/${props.playbackId}.m3u8`)
const thumbnailSrc = computed(
  () => `https://image.mux.com/${props.playbackId}/thumbnail.jpg?time=12`
)
const showThumbnail = computed(
  () => !loaded.value || currentTime.value <= 0 || ended.value
)

// Methods
const load = () => {
  if (Hls.isSupported()) {
    hls.value = new Hls()
    hls.value.loadSource(src.value)
    hls.value.attachMedia(video.value!)
    hls.value.on(Hls.Events.FRAG_LOADED, onLoad)
  } else {
    video.value!.src = src.value
    video.value!.load()
    loaded.value = true
  }
}

const onLoad = () => {
  loaded.value = true
}

onMounted(() => {
  load()
})
</script>

<style lang="postcss">
.player {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.player-media {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.player-video {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
}

.player-thumbnail {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
}
</style>
