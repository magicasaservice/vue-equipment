<template>
  <div
    class="magic-player-overlay"
    :data-playing="playing"
    :data-touched="touched"
    :data-paused="paused"
    :data-started="started"
    :data-waiting="waiting"
    :data-loaded="loaded"
    :data-muted="muted"
    :data-idle="idle"
    :data-hover="mouseEntered"
    @click.stop="togglePlay"
  >
    <slot>
      <transition name="fade" mode="out-in">
        <button
          v-if="defferedWaiting && started"
          class="magic-player-overlay__button"
        >
          <slot name="waitingIcon">
            <icon-waiting />
          </slot>
        </button>
        <button
          v-else-if="paused || !started"
          class="magic-player-overlay__button"
        >
          <slot name="playIcon">
            <icon-play />
          </slot>
        </button>
        <button
          v-else-if="started && !paused"
          class="magic-player-overlay__button"
        >
          <slot name="pauseIcon">
            <icon-pause />
          </slot>
        </button>
      </transition>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, inject, toRefs } from 'vue'
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
const {
  mouseEntered,
  playing,
  paused,
  started,
  touched,
  muted,
  loaded,
  waiting,
  hasOverlay,
} = toRefs(state)

// Immediately set hasOverlay to true
// to ensure proper interaction between overlay and controls
hasOverlay.value = true

const { togglePlay } = usePlayerVideoApi({
  id: instanceId,
})

const { idle } = useIdle(3000)

// Slightly defer waiting state to avoid flicker
const defferedWaiting = ref(false)

watch(
  () => waiting.value,
  (value) => {
    switch (value) {
      case true:
        defferedWaiting.value = true
        break
      case false:
        setTimeout(() => {
          defferedWaiting.value = false
        }, 1000)
        break
    }
  }
)
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
