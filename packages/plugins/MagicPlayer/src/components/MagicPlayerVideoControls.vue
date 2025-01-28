<template>
  <div
    class="magic-player-video-controls"
    :data-fullscreen="isFullscreen"
    :data-touched="touched"
    :data-playing="playing"
    :data-paused="!playing"
    :data-waiting="waiting"
    :data-muted="muted"
    :data-idle="idle"
    :data-hover="mouseEntered"
    :data-standalone="standalone"
  >
    <transition :name="mappedTransition">
      <div v-show="!hidden" class="magic-player-video-controls__bar">
        <div
          v-if="$slots.popover"
          v-show="!!seekedTime && touched"
          ref="popoverRef"
          class="magic-player-video-controls__popover"
          :style="{ marginLeft: `${popoverOffsetX}%` }"
        >
          <slot name="popover" />
        </div>
        <div ref="barRef" class="magic-player-video-controls__bar--inner">
          <div class="magic-player-video-controls__item -shrink-0">
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
          <div class="magic-player-video-controls__item -grow">
            <slot name="timelineBefore" />
            <div ref="trackRef" class="magic-player-video-controls__timeline">
              <magic-player-timeline :id="id" />
            </div>
            <slot name="timelineAfter" />
          </div>
          <div class="magic-player-video-controls__item -shrink-0">
            <button v-if="muted" @click="unmute">
              <slot name="volumeOffIcon">
                <icon-volume-off />
              </slot>
            </button>
            <button v-else @click="mute">
              <slot name="volumeOnIcon">
                <icon-volume-on />
              </slot>
            </button>
          </div>
          <div class="magic-player-video-controls__item -shrink-0">
            <button v-if="isFullscreen" @click="exitFullscreen">
              <slot name="fullscreenExitIcon">
                <icon-fullscreen-exit />
              </slot>
            </button>
            <button v-else @click="enterFullscreen">
              <slot name="fullscreenEnterIcon">
                <icon-fullscreen-enter />
              </slot>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject, provide } from 'vue'
import { useIdle } from '@vueuse/core'
import IconPlay from './icons/Play.vue'
import IconPause from './icons/Pause.vue'
import IconVolumeOn from './icons/VolumeOn.vue'
import IconVolumeOff from './icons/VolumeOff.vue'
import IconFullscreenEnter from './icons/FullscreenEnter.vue'
import IconFullscreenExit from './icons/FullscreenExit.vue'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { usePlayerVideoApi } from '../composables/private/usePlayerVideoApi'
import { usePlayerControlsApi } from '../composables/private/usePlayerControlsApi'
import { MagicPlayerInstanceId, MagicPlayerOptionsKey } from '../symbols'

import '@maas/vue-equipment/utils/css/animations/fade-up-in.css'
import '@maas/vue-equipment/utils/css/animations/fade-up-out.css'

interface MagicPlayerControlsProps {
  id?: string
  standalone?: boolean
  transition?: string
}

const {
  id,
  standalone = false,
  transition,
} = defineProps<MagicPlayerControlsProps>()

const instanceId = inject(MagicPlayerInstanceId, undefined)
const mappedId = computed(() => id ?? instanceId)

if (!mappedId.value) {
  throw new Error(
    'MagicPlayerVideoControls must be nested inside MagicPlayerProvider or be passed an id as a prop.'
  )
}

const injectedOptions = inject(MagicPlayerOptionsKey, undefined)

const mappedTransition = computed(
  () => transition ?? injectedOptions?.transition?.videoControls
)

const barRef = ref<HTMLDivElement | undefined>(undefined)
const trackRef = ref<HTMLDivElement | undefined>(undefined)
const popoverRef = ref<HTMLDivElement | undefined>(undefined)

const { playing, waiting, muted } = usePlayerMediaApi({
  id: mappedId.value,
})

const {
  touched,
  mouseEntered,
  isFullscreen,
  play,
  pause,
  mute,
  unmute,
  enterFullscreen,
  exitFullscreen,
} = usePlayerVideoApi({ id: mappedId.value })

const { popoverOffsetX, seekedTime } = usePlayerControlsApi({
  id: mappedId.value,
  barRef: barRef,
  trackRef: trackRef,
  popoverRef: popoverRef,
})

const { idle } = useIdle(3000)

const hidden = computed(() => {
  switch (true) {
    case standalone:
      return false
    case playing.value && idle.value:
      return true
    case playing.value && !mouseEntered.value:
      return true
    case !touched.value:
      return true
    default:
      return false
  }
})

provide(MagicPlayerInstanceId, mappedId.value)
</script>

<style>
:root {
  --magic-player-video-controls-height: 3rem;
  --magic-player-video-controls-padding: 0.75rem;
  --magic-player-video-controls-bottom: 1.5rem;
  --magic-player-video-controls-left: 1.5rem;
  --magic-player-video-controls-width: calc(
    100% - (var(--magic-player-video-controls-left) * 2)
  );
  --magic-player-video-controls-gap: 1rem;
  --magic-player-video-controls-border-radius: 50rem;
  --magic-player-video-controls-background: rgba(32, 32, 32, 0.8);
  --magic-player-video-controls-backdrop-filter: blur(80px);
  --magic-player-video-controls-color: rgba(255, 255, 255, 1);
  --magic-player-video-controls-button-width: 3rem;
  --magic-player-video-controls-icon-width: 1.25rem;
}

@media (max-width: 640px) {
  :root {
    --magic-player-video-controls-height: 2.5rem;
    --magic-player-video-controls-bottom: 0.75rem;
    --magic-player-video-controls-padding: 0.5rem;
  }
}

.magic-player-video-controls {
  position: absolute;
  inset: 0;
  width: 100%;
  pointer-events: none;
}

.magic-player-video-controls-enter-active {
  animation: fade-up-in 150ms ease;
}

.magic-player-video-controls-leave-active {
  animation: fade-up-out 150ms ease;
}

.magic-player-video-controls__bar {
  position: absolute;
  width: var(--magic-player-video-controls-width);
  bottom: var(--magic-player-video-controls-bottom);
  left: var(--magic-player-video-controls-left);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--magic-player-video-controls-gap);
  pointer-events: auto;
}

.magic-player-video-controls__bar--inner {
  width: 100%;
  box-sizing: border-box;
  height: var(--magic-player-video-controls-height);
  padding: 0 var(--magic-player-video-controls-padding);
  background-color: var(--magic-player-video-controls-background);
  backdrop-filter: var(--magic-player-video-controls-backdrop-filter);
  color: var(--magic-player-video-controls-color);
  border-radius: var(--magic-player-video-controls-border-radius);
  display: flex;
  align-items: center;
}

.magic-player-video-controls__item {
  display: inline-flex;
  align-items: center;
  user-select: none;
}

.magic-player-video-controls__item.-shrink-0 {
  flex-shrink: 0;
}

.magic-player-video-controls__item.-grow {
  flex-grow: 1;
}

.magic-player-video-controls__item button {
  background-color: transparent;
  color: inherit;
  border: 0;
  outline: none;
  appearance: none;
  padding: 0;
  border-radius: 0;
  cursor: pointer;
  width: var(--magic-player-video-controls-button-width);
  height: var(--magic-player-video-controls-height);
  display: flex;
  align-items: center;
  justify-content: center;
}

.magic-player-video-controls__item button svg {
  display: block;
  width: var(--magic-player-video-controls-icon-width);
  height: auto;
}

.magic-player-video-controls__timeline {
  width: 100%;
}

.magic-player-video-controls[data-standalone='true'] {
  position: relative;
  inset: unset;
  --magic-player-video-controls-width: 100%;
  --magic-player-video-controls-bottom: 0;
  --magic-player-video-controls-left: 0;
  --magic-player-video-controls-padding: 0;
  --magic-player-video-controls-background: unset;
  --magic-player-video-controls-border-radius: unset;
  --magic-player-video-controls-background: transparent;
  --magic-player-video-controls-backdrop-filter: none;
}

.magic-player-video-controls[data-standalone='true']
  .magic-player-video-controls__bar {
  position: relative;
}
</style>
