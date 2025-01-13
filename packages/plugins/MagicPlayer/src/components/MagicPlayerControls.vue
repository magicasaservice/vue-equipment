<template>
  <div
    class="magic-player-controls"
    :class="{
      '-fullscreen': isFullscreen,
      '-touched': touched,
      '-untouched': !touched,
      '-playing': playing,
      '-paused': !playing,
      '-waiting': waiting,
      '-idle': idle,
      '-not-idle': !idle,
      '-hover': mouseEntered,
      '-not-hover': !mouseEntered,
      '-standalone': standalone,
    }"
  >
    <transition :name="transition">
      <div v-show="!hidden" class="magic-player-controls__bar">
        <div
          v-if="$slots.seekPopover"
          v-show="!!seekedTime && touched"
          ref="popoverRef"
          class="magic-player-controls__popover"
          :style="{ marginLeft: `${popoverOffsetX}%` }"
        >
          <slot name="seekPopover" />
        </div>
        <div ref="barRef" class="magic-player-controls__bar--inner">
          <div class="magic-player-controls__item -shrink-0">
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
          <div class="magic-player-controls__item -grow">
            <slot name="timelineBefore" />
            <div ref="trackRef" class="magic-player-controls__timeline">
              <magic-player-timeline :id="id" />
            </div>
            <slot name="timelineAfter" />
          </div>
          <div class="magic-player-controls__item -shrink-0">
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
          <div class="magic-player-controls__item -shrink-0">
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

<script setup lang="ts">
import { ref, computed } from 'vue'
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

import '@maas/vue-equipment/utils/css/animations/fade-up-in.css'
import '@maas/vue-equipment/utils/css/animations/fade-up-out.css'

interface MagicPlayerControlsProps {
  id: string
  standalone?: boolean
  transition?: string
}

const props = withDefaults(defineProps<MagicPlayerControlsProps>(), {
  transition: 'magic-player-controls',
})

const barRef = ref<HTMLDivElement | undefined>(undefined)
const trackRef = ref<HTMLDivElement | undefined>(undefined)
const popoverRef = ref<HTMLDivElement | undefined>(undefined)

const { playing, waiting, muted } = usePlayerMediaApi({
  id: props.id,
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
} = usePlayerVideoApi({ id: props.id })

const { popoverOffsetX, seekedTime } = usePlayerControlsApi({
  id: props.id,
  barRef: barRef,
  trackRef: trackRef,
  popoverRef: popoverRef,
})

const { idle } = useIdle(3000)

const hidden = computed(() => {
  switch (true) {
    case props.standalone:
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
</script>

<style>
:root {
  --magic-player-controls-height: 3rem;
  --magic-player-controls-padding: 0.75rem;
  --magic-player-controls-bottom: 1.5rem;
  --magic-player-controls-left: 1.5rem;
  --magic-player-controls-width: calc(
    100% - (var(--magic-player-controls-left) * 2)
  );
  --magic-player-controls-gap: 1rem;
  --magic-player-controls-border-radius: 50rem;
  --magic-player-controls-background: rgba(32, 32, 32, 0.8);
  --magic-player-controls-backdrop-filter: blur(80px);
  --magic-player-controls-color: rgba(255, 255, 255, 1);
  --magic-player-controls-button-width: 3rem;
  --magic-player-controls-icon-width: 1.25rem;
}

@media (max-width: 640px) {
  :root {
    --magic-player-controls-height: 2.5rem;
    --magic-player-controls-bottom: 0.75rem;
    --magic-player-controls-padding: 0.5rem;
  }
}

.magic-player-controls {
  position: absolute;
  inset: 0;
  width: 100%;
  pointer-events: none;
}

.magic-player-controls-enter-active {
  animation: fade-up-in 150ms ease;
}

.magic-player-controls-leave-active {
  animation: fade-up-out 150ms ease;
}

.magic-player-controls__bar {
  position: absolute;
  width: var(--magic-player-controls-width);
  bottom: var(--magic-player-controls-bottom);
  left: var(--magic-player-controls-left);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--magic-player-controls-gap);
  pointer-events: auto;
}

.magic-player-controls__bar--inner {
  width: 100%;
  box-sizing: border-box;
  height: var(--magic-player-controls-height);
  padding: 0 var(--magic-player-controls-padding);
  background-color: var(--magic-player-controls-background);
  backdrop-filter: var(--magic-player-controls-backdrop-filter);
  color: var(--magic-player-controls-color);
  border-radius: var(--magic-player-controls-border-radius);
  display: flex;
  align-items: center;
}

.magic-player-controls__item {
  display: inline-flex;
  align-items: center;
  user-select: none;
}

.magic-player-controls__item.-shrink-0 {
  flex-shrink: 0;
}

.magic-player-controls__item.-grow {
  flex-grow: 1;
}

.magic-player-controls__item button {
  background-color: transparent;
  color: inherit;
  border: 0;
  outline: none;
  appearance: none;
  padding: 0;
  border-radius: 0;
  cursor: pointer;
  width: var(--magic-player-controls-button-width);
  height: var(--magic-player-controls-height);
  display: flex;
  align-items: center;
  justify-content: center;
}

.magic-player-controls__item button svg {
  display: block;
  width: var(--magic-player-controls-icon-width);
  height: auto;
}

.magic-player-controls__timeline {
  width: 100%;
}

.magic-player-controls.-standalone {
  position: relative;
  inset: unset;
  --magic-player-controls-width: 100%;
  --magic-player-controls-bottom: 0;
  --magic-player-controls-left: 0;
  --magic-player-controls-padding: 0;
  --magic-player-controls-background: unset;
  --magic-player-controls-border-radius: unset;
  --magic-player-controls-background: transparent;
  --magic-player-controls-backdrop-filter: none;
}

.magic-player-controls.-standalone .magic-player-controls__bar {
  position: relative;
}
</style>
