<template>
  <div
    class="magic-audio-player-controls"
    :class="{
      '-touched': touched,
      '-untouched': !touched,
      '-playing': playing,
      '-paused': !playing,
      '-waiting': waiting,
      '-idle': idle,
      '-not-idle': !idle,
      '-hover': mouseEntered,
      '-not-hover': !mouseEntered,
    }"
  >
    <div class="magic-audio-player-controls__bar">
      <div class="magic-audio-player-controls__bar--inner" ref="barRef">
        <div
          class="magic-audio-player-controls__item -shrink-0"
          data-slot="play-toggle"
        >
          <button v-if="!playing" @click="play">
            <slot name="playIcon">
              <icon-play />
            </slot>
          </button>
          <button v-else @click="pause">
            <slot name="pauseIcon">
              <icon-pause />
            </slot>
          </button>
        </div>
        <div
          class="magic-audio-player-controls__item -shrink-0"
          data-slot="display-time-current"
        >
          <magic-player-display-time :id="id" type="current" />
        </div>
        <div
          class="magic-audio-player-controls__item -grow"
          data-slot="timeline"
        >
          <div class="magic-audio-player-controls__timeline" ref="trackRef">
            <magic-player-timeline :id="id" />
          </div>
        </div>
        <div
          class="magic-audio-player-controls__item -shrink-0"
          data-slot="display-time-duration"
        >
          <magic-player-display-time :id="id" type="duration" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useIdle } from '@vueuse/core'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { usePlayerAudioApi } from '../composables/private/usePlayerAudioApi'
import { usePlayerControlsApi } from '../composables/private/usePlayerControlsApi'
import IconPlay from './icons/Play.vue'
import IconPause from './icons/Pause.vue'

interface Props {
  id: string
}

const props = defineProps<Props>()

const barRef = ref<HTMLDivElement | undefined>(undefined)
const trackRef = ref<HTMLDivElement | undefined>(undefined)

const { playing, waiting } = usePlayerMediaApi({
  id: props.id,
})

const { play, pause, touched, mouseEntered } = usePlayerAudioApi({
  id: props.id,
})

usePlayerControlsApi({
  id: props.id,
  barRef: barRef,
  trackRef: trackRef,
})

const { idle } = useIdle(3000)
</script>

<style lang="css">
:root {
  --magic-audio-player-controls-height: 3rem;
  --magic-audio-player-controls-padding: 0rem;
  --magic-audio-player-controls-color: inherit;
  --magic-audio-player-controls-icon-width: 1.25rem;
  --magic-audio-player-controls-button-width: 4rem;
}

.magic-audio-player-controls {
  width: 100%;
  pointer-events: none;
}

.magic-audio-player-controls__bar {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  pointer-events: auto;
}

.magic-audio-player-controls__bar--inner {
  width: 100%;
  box-sizing: border-box;
  height: var(--magic-audio-player-controls-height);
  padding: 0 var(--magic-audio-player-controls-padding);
  color: var(--magic-audio-player-controls-color);
  display: flex;
  align-items: center;
}

.magic-audio-player-controls__item {
  display: inline-flex;
  align-items: center;
  user-select: none;
}

.magic-audio-player-controls__item.-shrink-0 {
  flex-shrink: 0;
}

.magic-audio-player-controls__item.-grow {
  flex-grow: 1;
}

.magic-audio-player-controls__item button {
  background-color: transparent;
  color: inherit;
  border: 0;
  outline: none;
  appearance: none;
  padding: 0;
  border-radius: 0;
  cursor: pointer;
  width: var(--magic-audio-player-controls-button-width);
  height: var(--magic-audio-player-controls-height);
  display: flex;
  align-items: center;
  justify-content: center;
}

.magic-audio-player-controls__item button svg {
  display: block;
  width: var(--magic-audio-player-controls-icon-width);
  height: auto;
}

.magic-audio-player-controls__timeline {
  width: 100%;
}

@container (max-width: 480px) {
  .magic-audio-player-controls__item[data-slot='display-time-current'] {
    display: none;
  }
}

@container (max-width: 320px ) {
  .magic-audio-player-controls__item[data-slot='display-time-duration'] {
    display: none;
  }
  .magic-audio-player-controls__item[data-slot='timeline'] {
    padding-right: 1rem;
  }
}

@container (max-width: 240px) {
  .magic-audio-player-controls__item[data-slot='timeline'] {
    display: none;
  }
  .magic-audio-player-controls__bar--inner {
    justify-content: center;
  }
}
</style>
