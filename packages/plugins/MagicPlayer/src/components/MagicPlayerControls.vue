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
      <div class="magic-player-controls__item -shrink-0">
        <button v-if="!playing" @click="play">
          <icon-play />
        </button>
        <button v-else @click="pause">
          <icon-pause />
        </button>
      </div>
      <div class="magic-player-controls__item -grow">
        <magic-player-timeline />
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
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { MediaApiInjectionKey, PlayerApiInjectionKey } from './../types'
import { useIdle } from '@vueuse/core'

import IconPlay from './icons/Play.vue'
import IconPause from './icons/Pause.vue'
import IconVolumeOn from './icons/VolumeOn.vue'
import IconVolumeOff from './icons/VolumeOff.vue'
import IconFullscreenEnter from './icons/FullscreenEnter.vue'
import IconFullscreenExit from './icons/FullscreenExit.vue'
import IconWaiting from './icons/Waiting.vue'

const { playing, muted, waiting } = inject(MediaApiInjectionKey)!

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
} = inject(PlayerApiInjectionKey)!

const { idle } = useIdle(3000)
const isMouseEnter = ref(false)
</script>

<style lang="postcss">
:root {
  --magic-player-controls-height: 3rem;
  --magic-player-controls-bottom: 1.5rem;
  --magic-player-controls-padding: 0.75rem;
  --magic-player-controls-border-radius: 50rem;
  --magic-player-controls-background-color: rgba(32, 32, 32, 0.8);
  --magic-player-backdrop-filter: blur(80px);
  --magic-player-controls-color: rgba(255, 255, 255, 1);
  --magic-player-controls-overlay-background-color: rgba(0, 0, 0, 0.3);
  --magic-player-controls-overlay-color: rgba(255, 255, 255, 1);

  @media (max-width: 640px) {
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
  transition-timing-function: ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.magic-player-controls__overlay button {
  background-color: transparent;
  color: inherit;
  border: 0;
  outline: none;
  appearance: none;
  cursor: pointer;
}

.magic-player-controls__overlay button,
.magic-player-controls__overlay i {
  width: 3.5rem;
  height: 3.5rem;
}

.magic-player-controls__bar {
  position: absolute;
  width: calc(100% - (var(--magic-player-controls-bottom) * 2));
  height: var(--magic-player-controls-height);
  bottom: var(--magic-player-controls-bottom);
  left: 50%;
  transform: translateX(-50%);
  padding: 0 var(--magic-player-controls-padding);
  margin: 0 auto;
  display: flex;
  align-items: center;
  border-radius: var(--magic-player-controls-border-radius);
  color: var(--magic-player-controls-color);
  background-color: var(--magic-player-controls-background-color);
  backdrop-filter: var(--magic-player-backdrop-filter);
  transition-duration: 300ms;
  transition-property: opacity, transform;
  transition-timing-function: ease-out;
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
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.magic-player-controls__item button svg {
  display: block;
  width: 1.25rem;
  height: auto;
}

.magic-player-controls__item time {
  display: inline-flex;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
  padding: 0 0.25rem;
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
