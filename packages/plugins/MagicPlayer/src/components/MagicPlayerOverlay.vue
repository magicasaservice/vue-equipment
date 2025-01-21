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
    <slot>
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
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { useIdle } from '@vueuse/core'
import IconPlay from './icons/Play.vue'
import IconPause from './icons/Pause.vue'
import IconWaiting from './icons/Waiting.vue'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { usePlayerVideoApi } from '../composables/private/usePlayerVideoApi'

interface MagicPlayerOverlayProps {
  id: string
}

const props = defineProps<MagicPlayerOverlayProps>()

const { playing, waiting } = usePlayerMediaApi({
  id: props.id,
})
const { mouseEntered, togglePlay } = usePlayerVideoApi({
  id: props.id,
})

const { idle } = useIdle(3000)
</script>

<style>
.magic-player-overlay {
  position: absolute;
  inset: 0;
  background-color: var(--magic-player-overlay-background, rgba(0, 0, 0, 0.3));
  color: var(--magic-player-overlay-color, rgba(255, 255, 255, 1));
  transition: var(--magic-player-overlay-transition, opacity 300ms ease);
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
  width: var(--magic-player-overlay-button-size, 2.5rem);
  height: var(--magic-player-overlay-button-size, 2.5rem);
}

.magic-player-overlay.-playing.-idle,
.magic-player-overlay.-playing.-not-hover {
  opacity: 0;
}
</style>
