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
      '-hover': isMouseEnter,
      '-not-hover': !isMouseEnter,
    }"
    @mouseenter="isMouseEnter = true"
    @mouseleave="isMouseEnter = false"
  >
    <div class="magic-player-controls__overlay" @click.stop="togglePlay">
      <template v-if="waiting">
        <button>
          <icon-waiting />
        </button>
      </template>
      <template v-else>
        <button v-if="!playing">
          <icon-play />
        </button>
        <button v-else>
          <icon-pause />
        </button>
      </template>
    </div>
    <div class="magic-player-controls__bar">
      <div
        v-if="$slots.seekPopover"
        v-show="!!seekedTime && touched"
        ref="popoverRef"
        class="magic-player-controls__popover"
        :style="{ marginLeft: `${popoverOffsetX}%` }"
      >
        <slot name="seekPopover" />
      </div>
      <div class="magic-player-controls__bar--inner" ref="barRef">
        <div class="magic-player-controls__item -shrink-0">
          <button v-if="!playing" @click="play">
            <icon-play />
          </button>
          <button v-else @click="pause">
            <icon-pause />
          </button>
        </div>
        <div class="magic-player-controls__item -grow">
          <div class="magic-player-controls__timeline" ref="trackRef">
            <magic-player-timeline />
          </div>
        </div>
        <div class="magic-player-controls__item -shrink-0">
          <button v-if="muted" @click="unmute">
            <icon-volume-off />
          </button>
          <button v-else @click="mute">
            <icon-volume-on />
          </button>
        </div>
        <div class="magic-player-controls__item -shrink-0">
          <button v-if="isFullscreen" @click="exitFullscreen">
            <icon-fullscreen-exit />
          </button>
          <button v-else @click="enterFullscreen">
            <icon-fullscreen-enter />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useIdle } from '@vueuse/core'
import IconPlay from './icons/Play.vue'
import IconPause from './icons/Pause.vue'
import IconVolumeOn from './icons/VolumeOn.vue'
import IconVolumeOff from './icons/VolumeOff.vue'
import IconFullscreenEnter from './icons/FullscreenEnter.vue'
import IconFullscreenExit from './icons/FullscreenExit.vue'
import IconWaiting from './icons/Waiting.vue'
import { useInjectPlayer } from '../composables/usePlayer'
import { useProvideControls } from '../composables/useControls'

const barRef = ref<HTMLDivElement | undefined>(undefined)
const trackRef = ref<HTMLDivElement | undefined>(undefined)
const popoverRef = ref<HTMLDivElement | undefined>(undefined)

const { mediaApi, playerApi } = useInjectPlayer()
const { controlsApi } = useProvideControls({
  barRef: barRef,
  trackRef: trackRef,
  popoverRef: popoverRef,
})

const { playing, muted, waiting } = mediaApi
const {
  touched,
  isFullscreen,
  play,
  pause,
  togglePlay,
  mute,
  unmute,
  enterFullscreen,
  exitFullscreen,
} = playerApi

const { popoverOffsetX, seekedTime } = controlsApi

const { idle } = useIdle(3000)
const isMouseEnter = ref(false)

defineExpose({
  controlsApi,
})
</script>

<style lang="css">
:root {
  --magic-player-controls-height: 3rem;
  --magic-player-controls-bottom: 1.5rem;
  --magic-player-controls-padding: 0.75rem;
  --magic-player-controls-gap: 1rem;
  --magic-player-controls-border-radius: 50rem;
  --magic-player-controls-background-color: rgba(32, 32, 32, 0.8);
  --magic-player-controls-backdrop-filter: blur(80px);
  --magic-player-controls-color: rgba(255, 255, 255, 1);
  --magic-player-controls-icon-width: 1.25rem;
  --magic-player-controls-overlay-background-color: rgba(0, 0, 0, 0.3);
  --magic-player-controls-overlay-color: rgba(255, 255, 255, 1);
  --magic-player-controls-transition-duration: 300ms;
  --magic-player-controls-transition-timing-function: ease: ;
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
}

.magic-player-controls__overlay {
  position: absolute;
  inset: 0;
  background-color: var(--magic-player-controls-overlay-background-color);
  color: var(--magic-player-controls-overlay-color);
  transition-duration: 300ms;
  transition-property: opacity;
  transition-timing-function: ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.magic-player-controls__overlay button {
  background-color: transparent;
  color: inherit;
  border: 0;
  border-radius: 0;
  padding: 0;
  outline: none;
  appearance: none;
  cursor: pointer;
  width: 3.5rem;
  height: 3.5rem;
}

.magic-player-controls__bar {
  position: absolute;
  width: calc(100% - (var(--magic-player-controls-bottom) * 2));
  bottom: var(--magic-player-controls-bottom);
  left: 50%;
  transform: translateX(-50%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--magic-player-controls-gap);
  transition-duration: var(--magic-player-controls-transition-duration);
  transition-timing-function: var(
    --magic-player-controls-transition-timing-function
  );
  transition-property: opacity, transform;
}

.magic-player-controls__bar--inner {
  width: 100%;
  box-sizing: border-box;
  height: var(--magic-player-controls-height);
  padding: 0 var(--magic-player-controls-padding);
  background-color: var(--magic-player-controls-background-color);
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
  width: var(--magic-player-controls-height);
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

.magic-player-controls.-playing.-idle .magic-player-controls__bar,
.magic-player-controls.-playing.-not-hover .magic-player-controls__bar,
.magic-player-controls.-untouched .magic-player-controls__bar {
  opacity: 0;
  transform: translate(-50%, 25%);
}

.magic-player-controls.-playing.-idle .magic-player-controls__overlay,
.magic-player-controls.-playing.-not-hover .magic-player-controls__overlay {
  opacity: 0;
}
</style>
