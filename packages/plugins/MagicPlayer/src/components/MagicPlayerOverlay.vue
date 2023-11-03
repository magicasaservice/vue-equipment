<template>
  <div
    class="magic-player-overlay"
    :class="{
      '-playing': playing,
      '-paused': !playing,
      '-idle': idle,
      '-not-idle': !idle,
      '-hover': mouseEntered,
      '-not-hover': !mouseEntered,
    }"
    @click.stop="togglePlay"
  >
    <template v-if="waiting">
      <button class="magic-player-overlay__button">
        <slot name="waitingIcon">
          <icon-waiting />
        </slot>
      </button>
    </template>
    <template v-else>
      <button v-if="!playing" class="magic-player-overlay__button">
        <slot name="playIcon">
          <icon-play />
        </slot>
      </button>
      <button v-else class="magic-player-overlay__button">
        <slot name="pauseIcon">
          <icon-pause />
        </slot>
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import {} from 'vue'
import { useIdle } from '@vueuse/core'
import IconPlay from './icons/Play.vue'
import IconPause from './icons/Pause.vue'
import IconWaiting from './icons/Waiting.vue'
import { usePlayerApi } from '../composables/usePlayerApi'

interface Props {
  id: string
}

const props = defineProps<Props>()

const { instance } = usePlayerApi(props.id)

const { playing, waiting } = instance.value.mediaApi
const { mouseEntered, togglePlay } = instance.value.playerApi

const { idle } = useIdle(3000)
</script>

<style lang="css">
:root {
  --magic-player-overlay-background-color: rgba(0, 0, 0, 0.3);
  --magic-player-overlay-color: rgba(255, 255, 255, 1);
  --magic-player-overlay-button-size: 2.5rem;
}

.magic-player-overlay {
  position: absolute;
  inset: 0;
  background-color: var(--magic-player-overlay-background-color);
  color: var(--magic-player-overlay-color);
  transition-duration: 300ms;
  transition-property: opacity;
  transition-timing-function: ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.magic-player-overlay__button {
  background-color: transparent;
  color: inherit;
  border: 0;
  border-radius: 0;
  padding: 0;
  outline: none;
  appearance: none;
  cursor: pointer;
  width: var(--magic-player-overlay-button-size);
  height: var(--magic-player-overlay-button-size);
}

.magic-player-overlay.-playing.-idle,
.magic-player-overlay.-playing.-not-hover {
  opacity: 0;
}
</style>
