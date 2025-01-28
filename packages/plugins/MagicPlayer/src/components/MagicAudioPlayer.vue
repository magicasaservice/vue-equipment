<template>
  <div ref="playerRef" class="magic-audio-player" :data-slot="$slots.default">
    <div class="magic-audio-player__container">
      <div v-if="$slots.default" class="magic-audio-player__slot">
        <slot />
      </div>
      <magic-audio-player-controls :id="id" />
    </div>
    <audio ref="audioRef" class="magic-audio-player__audio" />
  </div>
</template>

<script lang="ts" setup>
import MagicAudioPlayerControls from './MagicAudioPlayerControls.vue'
import { ref, onMounted, onBeforeUnmount, provide } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { usePlayerAudioApi } from '../composables/private/usePlayerAudioApi'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { usePlayerRuntime } from '../composables/private/usePlayerRuntime'
import { MagicPlayerInstanceId } from '../symbols'

interface MagicAudioPlayerProps {
  id: string
  src: string
}

const { id, src = '' } = defineProps<MagicAudioPlayerProps>()

const playerRef = ref<HTMLDivElement | undefined>(undefined)
const audioRef = ref<HTMLVideoElement | undefined>(undefined)

const pausedByIntersection = ref(false)

const { playing } = usePlayerMediaApi({
  id: id,
  mediaRef: audioRef,
})

const { initialize, destroy } = usePlayerRuntime({
  id: id,
  mediaRef: audioRef,
  src: src,
  srcType: 'native',
})

const { play, pause } = usePlayerAudioApi({
  id: id,
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

provide(MagicPlayerInstanceId, id)
</script>

<style>
:root {
  --magic-audio-player-border-radius: 1.25rem;
  --magic-audio-player-padding: 0.25rem;
  --magic-audio-player-slot-radius: calc(
    var(--magic-audio-player-border-radius) - var(--magic-audio-player-padding)
  );
}

.magic-audio-player {
  position: relative;
  width: 100%;
  color: var(--magic-audio-player-color, rgba(255, 255, 255, 1));
  background: var(--magic-audio-player-background, rgba(32, 32, 32, 0.8));
  backdrop-filter: var(--magic-audio-player-backdrop-filter, blur(80px));
  border-radius: var(--magic-audio-player-border-radius);
  padding: var(--magic-audio-player-padding);
  container-type: inline-size;
}

.magic-audio-player[data-slot='true'] {
  background: var(
    --magic-audio-player-background-slot,
    rgba(250, 250, 250, 0.15)
  );
}

.magic-audio-player__container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--magic-audio-player-gap, 0.25rem);
}

.magic-audio-player__slot {
  padding: var(--magic-audio-player-slot-padding, 0.75rem 1rem);
  background-color: var(
    --magic-audio-player-slot-background,
    rgba(32, 32, 32, 0.8)
  );
  border-radius: var(--magic-audio-player-slot-radius);
  color: inherit;
}

.magic-audio-player__audio {
  width: 100%;
}
</style>
