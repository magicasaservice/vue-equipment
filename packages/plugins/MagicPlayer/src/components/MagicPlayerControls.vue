<template>
  <div
    class="magic-player-controls"
    :class="{
      '-playing': playing,
      '-paused': !playing,
      '-waiting': waiting,
      '-idle': idle,
    }"
  >
    <div class="magic-player-controls__overlay" @click="togglePlay"></div>
    <div class="magic-player-controls__bar">
      <div class="magic-player-controls__item -shrink-0">
        <button v-if="playing" @click="pause">
          <icon-pause />
        </button>
        <button v-else @click="play">
          <icon-play />
        </button>
      </div>
      <div class="magic-player-controls__item -shrink-0">
        <time>{{ formatTime(currentTime) }}</time>
      </div>
      <div class="magic-player-controls__item -grow">
        <div
          ref="timeline"
          class="magic-player-controls__timeline"
          @mouseenter="onTimelineEnter"
          @mouseleave="onTimelineLeave"
          @mousedown="onTimelineDown"
          @mouseup="onTimelineUp"
        >
          <div class="magic-player-controls__progress-track">
            <div class="magic-player-controls__progress-inner-track">
              <div
                class="magic-player-controls__progress-buffered"
                :style="{ width: `${bufferedPercentage}%` }"
              />
              <div
                v-show="isMouseEnterTimeline"
                class="magic-player-controls__progress-seeked"
                :style="{ width: `${seekedPercentage}%` }"
              />
              <div
                class="magic-player-controls__progress-scrubbed"
                :style="{ width: `${scrubbedWidth}%` }"
              >
                <div class="magic-player-controls__progress-thumb" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="magic-player-controls__item -shrink-0">
        <time>{{ formatTime(duration) }}</time>
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
        <button>
          <icon-fullscreen-enter />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject, nextTick, onMounted } from 'vue'
import { MediaApiInjectionKey } from './../types'
import { useIdle, useResizeObserver } from '@vueuse/core'
import { formatTime } from './../utils'

import IconPlay from './icons/Play.vue'
import IconPause from './icons/Pause.vue'
import IconVolumeOn from './icons/VolumeOn.vue'
import IconVolumeOff from './icons/VolumeOff.vue'
import IconFullscreenEnter from './icons/FullscreenEnter.vue'

const timeline = ref<HTMLDivElement | undefined>(undefined)

const {
  duration,
  currentTime,
  playing,
  muted,
  buffered,
  waiting,
  play,
  pause,
  togglePlay,
  mute,
  unmute,
  seek,
} = inject(MediaApiInjectionKey)!

const { idle } = useIdle(3000)

const isMouseEnterTimeline = ref(false)
const isMouseDownTimeline = ref(false)
const resumePlay = ref(false)
const seekedTime = ref(0)
const scrubbed = ref(0)
const seekedPercentage = ref(0)
const thumbPercentage = ref(0)
const timelineRect = ref<DOMRect | undefined>(undefined)

const scrubbedWidth = computed(
  () =>
    ((100 - thumbPercentage.value) / 100) * scrubbed.value +
    thumbPercentage.value
)
const endBuffer = computed(() =>
  buffered.value.length > 0 ? buffered.value[buffered.value.length - 1][1] : 0
)
const bufferedPercentage = computed(
  () => (endBuffer.value / duration.value) * 100
)

watch(currentTime, (value) => {
  if (!isMouseEnterTimeline.value) {
    scrubbed.value = (currentTime.value / duration.value) * 100
  }
})

const onTimelineEnter = (e: MouseEvent) => {
  isMouseEnterTimeline.value = true
  document.addEventListener('mousemove', onMouseMove)
}

const onTimelineLeave = () => {
  isMouseEnterTimeline.value = false
  seekedTime.value = 0
  if (isMouseDownTimeline.value) {
    isMouseDownTimeline.value = false
  }
  document.removeEventListener('mousemove', onMouseMove)
}

const onTimelineDown = () => {
  isMouseDownTimeline.value = true
  resumePlay.value = playing.value
  nextTick(() => pause())
}

const onTimelineUp = () => {
  isMouseDownTimeline.value = false
  if (resumePlay.value) {
    nextTick(() => play())
  }
}

const onMouseMove = (e: MouseEvent) => {
  const x = e.pageX - timelineRect.value!.x
  const width = timelineRect.value!.width
  const height = timelineRect.value!.height

  const percentage = Math.round((x / width) * 100)
  const time = Math.round(((x - height / 2) / (width - height)) * 100)

  const timeClamped = Math.min(100, Math.max(0, time))

  seekedPercentage.value = Math.min(
    100,
    Math.max(0, percentage + thumbPercentage.value / 2)
  )

  seekedTime.value = (duration.value * timeClamped) / 100

  if (isMouseDownTimeline.value) {
    scrubbed.value = timeClamped
    seek(seekedTime.value)
  }
}

const getTimelineSize = () => {
  timelineRect.value = timeline.value?.getBoundingClientRect()
  thumbPercentage.value =
    (timelineRect.value!.height / timelineRect.value!.width) * 100
}

useResizeObserver(timeline, getTimelineSize)

onMounted(() => {
  getTimelineSize()
})
</script>

<style lang="postcss">
.magic-player-controls {
  position: absolute;
  inset: 0;
}

.magic-player-controls.-playing.-idle {
  .magic-player-controls__bar {
    opacity: 0;
    transform: translate(-50%, 25%);
  }
}

.magic-player-controls__overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition-duration: 300ms;
  transition-property: opacity;
  transition-timing-function: ease-out;
}

.magic-player-controls.-paused .magic-player-controls__overlay {
  opacity: 1;
}

.magic-player-controls__bar {
  position: absolute;
  width: calc(100% - 3rem);
  /* max-width: 30rem; */
  height: 2.5rem;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 1rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: 999px;
  color: rgb(255, 255, 255);
  background-color: rgba(34, 34, 34, 0.8);
  backdrop-filter: blur(80px);
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
  border: 0;
  outline: none;
  appearance: none;
  padding: 0 5px;
  cursor: pointer;
}

.magic-player-controls__item button svg {
  display: block;
  width: 1.25rem;
}

.magic-player-controls__item time {
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  min-width: 3rem;
  display: inline-flex;
  justify-content: center;
}

.magic-player-controls__timeline {
  position: relative;
  width: 100%;
  height: 2rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.magic-player-controls__timeline:hover .magic-player-controls__progress-thumb {
  transform: scale(1);
}

.magic-player-controls__progress-track {
  position: relative;
  width: 100%;
  height: 2rem;
  background: rgba(250, 250, 250, 0.15);
  border-radius: 999px;
}

.magic-player-controls__progress-inner-track {
  position: relative;
  border-radius: 999px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

.magic-player-controls__progress-thumb {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  margin-left: auto;
  border: 0.175rem currentColor solid;
  background-color: rgba(34, 34, 34, 0.8);
  transform: scale(0);
  transform-origin: center;
  transition: transform cubic-bezier(0.65, 0, 0.35, 1) 0.3s;
  z-index: 10;
}

.magic-player-controls__progress-scrubbed,
.magic-player-controls__progress-seeked,
.magic-player-controls__progress-buffered {
  position: absolute;
  left: 0;
  background: currentColor;
  height: 100%;
  border-radius: 999px;
}

.magic-player-controls__progress-scrubbed {
  z-index: 1;
  min-width: 2rem;
  display: flex;
}

.magic-player-controls__progress-seeked {
  opacity: 0.25;
}

.magic-player-controls__progress-buffered {
  opacity: 0.15;
}
</style>
