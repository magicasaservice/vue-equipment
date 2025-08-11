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
    <transition :name="mappedOverlayTransition">
      <div v-if="isVisible" class="magic-player-overlay__controls">
        <slot>
          <transition :name="mappedIconsTransition">
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
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, computed, inject, toRefs } from 'vue'
import { useIdle } from '@vueuse/core'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'

import IconPlay from './icons/Play.vue'
import IconPause from './icons/Pause.vue'
import IconWaiting from './icons/Waiting.vue'

import { usePlayerState } from '../composables/private/usePlayerState'
import { usePlayerVideoApi } from '../composables/private/usePlayerVideoApi'

import { MagicPlayerInstanceId, MagicPlayerOptionsKey } from '../symbols'

interface MagicPlayerOverlayProps {
  transition?: {
    overlay?: string
    icons?: string
  }
}

const { transition } = defineProps<MagicPlayerOverlayProps>()

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicPlayer',
  source: 'MagicPlayer',
})

const instanceId = inject(MagicPlayerInstanceId, undefined)
const injectedOptions = inject(MagicPlayerOptionsKey, undefined)

magicError.assert(instanceId, {
  message: 'MagicPlayerOverlay must be nested inside MagicPlayerProvider.',
  statusCode: 400,
})

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

const mappedOverlayTransition = computed(
  () => transition?.overlay ?? injectedOptions?.transition?.overlay
)

const mappedIconsTransition = computed(
  () => transition?.icons ?? injectedOptions?.transition?.icons
)

const { togglePlay } = usePlayerVideoApi({
  id: instanceId,
})

const { idle } = useIdle(injectedOptions?.threshold?.idle)

const isVisible = computed(() => {
  switch (true) {
    case playing.value && idle.value:
    case playing.value && !mouseEntered.value:
    case injectedOptions?.autoplay && (!started.value || !mouseEntered.value):
      return false
    default:
      return true
  }
})

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
        }, 500)
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
  cursor: pointer;
}

.magic-player-overlay__controls {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  width: var(--magic-player-overlay-button-size, 2rem);
  height: var(--magic-player-overlay-button-size, 2rem);
}

.magic-player-overlay-enter-active {
  animation: fade-in 150ms ease;
}

.magic-player-overlay-leave-active {
  animation: fade-out 150ms ease;
}

.magic-player-icons-enter-active {
  animation: none;
  position: absolute;
}

.magic-player-icons-leave-active {
  animation: none;
  position: absolute;
}
</style>
