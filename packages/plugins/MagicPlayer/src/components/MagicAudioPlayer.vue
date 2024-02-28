<template>
  <div
    ref="playerRef"
    class="magic-audio-player"
    :class="{ '-slot': $slots.default }"
  >
    <div class="magic-audio-player__container">
      <div v-if="$slots.default" class="magic-audio-player__slot">
        <slot />
      </div>
      <magic-audio-player-controls :id="id" />
    </div>
    <audio ref="audioRef" class="magic-audio-player__audio" />
  </div>
</template>

<script setup lang="ts">
import MagicAudioPlayerControls from './MagicAudioPlayerControls.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { usePlayerAudioApi } from '../composables/private/usePlayerAudioApi'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { usePlayerRuntime } from '../composables/private/usePlayerRuntime'

interface Props {
  id: string
  src: string
  loop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  loop: false,
})

const playerRef = ref<HTMLDivElement | undefined>(undefined)
const audioRef = ref<HTMLVideoElement | undefined>(undefined)

const pausedByIntersection = ref(false)

const { playing } = usePlayerMediaApi({
  id: props.id,
  mediaRef: audioRef,
})

const { initialize, destroy } = usePlayerRuntime({
  id: props.id,
  mediaRef: audioRef,
  src: props.src,
  srcType: 'native',
})

const { play, pause } = usePlayerAudioApi({
  id: props.id,
})

useIntersectionObserver(
  playerRef,
  ([{ isIntersecting }]) => {
    if (!isIntersecting && playing.value) {
      pause()
      pausedByIntersection.value = true
    } else if (isIntersecting && !playing.value && pausedByIntersection.value) {
      pausedByIntersection.value = false

      play()
    }
  },
  {
    immediate: true,
  }
)

onMounted(() => {
  initialize()
})

onBeforeUnmount(() => {
  destroy()
})
</script>

<style>
:root {
  --magic-audio-player-color: rgba(255, 255, 255, 1);
  --magic-audio-player-background: rgba(32, 32, 32, 0.8);
  --magic-audio-player-background-slot: rgba(250, 250, 250, 0.15);
  --magic-audio-player-backdrop-filter: blur(80px);
  --magic-audio-player-border-radius: 1.25rem;
  --magic-audio-player-padding: 0.25rem;
  --magic-audio-player-gap: 0.25rem;
  --magic-audio-player-slot-padding: 0.75rem 1rem;
  --magic-audio-player-slot-radius: calc(
    var(--magic-audio-player-border-radius) - var(--magic-audio-player-padding)
  );
  --magic-audio-player-slot-background: rgba(32, 32, 32, 0.8);
}

.magic-audio-player {
  position: relative;
  width: 100%;
  color: var(--magic-audio-player-color);
  background: var(--magic-audio-player-background);
  backdrop-filter: var(--magic-audio-player-backdrop-filter);
  border-radius: var(--magic-audio-player-border-radius);
  padding: var(--magic-audio-player-padding);
}

.magic-audio-player.-slot {
  background: var(--magic-audio-player-background-slot);
}

.magic-audio-player__container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--magic-audio-player-gap);
}

.magic-audio-player__slot {
  padding: var(--magic-audio-player-slot-padding);
  background-color: var(--magic-audio-player-background);
  border-radius: var(--magic-audio-player-slot-radius);
  color: inherit;
}

.magic-audio-player__audio {
  width: 100%;
}
</style>
