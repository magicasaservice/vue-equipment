<template>
  <div
    class="magic-player-overlay"
    :data-playing="playing"
    :data-paused="!playing"
    :data-waiting="waiting"
    :data-idle="idle"
    :data-hover="mouseEntered"
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
import { inject, toRefs } from 'vue'
import { useIdle } from '@vueuse/core'
import IconPlay from './icons/Play.vue'
import IconPause from './icons/Pause.vue'
import IconWaiting from './icons/Waiting.vue'
import { usePlayerState } from '../composables/private/usePlayerState'
import { usePlayerVideoApi } from '../composables/private/usePlayerVideoApi'
import { MagicPlayerInstanceId } from '../symbols'

const instanceId = inject(MagicPlayerInstanceId, undefined)

if (!instanceId) {
  throw new Error(
    'MagicPlayerOverlay must be nested inside MagicPlayerProvider.'
  )
}

const { initializeState } = usePlayerState(instanceId)
const state = initializeState()
const { mouseEntered, playing, waiting } = toRefs(state)

const { togglePlay } = usePlayerVideoApi({
  id: instanceId,
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

.magic-player-overlay[data-playing='true'][data-idle='true'] {
  opacity: 0;
}

.magic-player-overlay[data-playing='true'][data-hover='false'] {
  opacity: 0;
}
</style>
