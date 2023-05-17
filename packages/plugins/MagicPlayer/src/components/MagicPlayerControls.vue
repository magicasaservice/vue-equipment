<template>
  <div class="player-controls">
    <div class="player-controls__bar">
      <div class="player-controls__item -shrink">
        <button v-if="playing" @click="pause">
          <icon-pause />
        </button>
        <button v-else @click="play">
          <icon-play />
        </button>
      </div>
      <div class="player-controls__item -grow">
        <div
          ref="timeline"
          class="player-timeline"
          @mouseenter="onTimelineEnter"
          @mouseleave="onTimelineLeave"
          @mousedown="onTimelineDown"
          @mouseup="onTimelineUp"
        >
          <div class="player-progress-track">
            <div class="player-progress-inner-track">
              <div
                class="player-progress-buffered"
                :style="{ width: `${bufferedPercentage}%` }"
              />
              <div
                v-show="isMouseEnterTimeline"
                class="player-progress-seeked"
                :style="{ width: `${seekedPercentage}%` }"
              />
              <div
                class="player-progress-scrubbed"
                :style="{ width: `${scrubbedWidth}%` }"
              >
                <div class="player-progress-thumb" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="player-controls__item -shrink">
        <button v-if="muted" @click="unmute">
          <icon-volume-off />
        </button>
        <button v-else @click="mute">
          <icon-volume-on />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject, onMounted } from 'vue'
import { mediaApiInjectionKey } from './../types'

import IconPlay from './icons/Play.vue'
import IconPause from './icons/Pause.vue'
import IconVolumeOn from './icons/VolumeOn.vue'
import IconVolumeOff from './icons/VolumeOff.vue'

const timeline = ref<HTMLDivElement | undefined>(undefined)

const {
  duration,
  currentTime,
  playing,
  muted,
  buffered,
  play,
  pause,
  mute,
  unmute,
  seek,
} = inject(mediaApiInjectionKey)!

const isMouseEnterTimeline = ref(false)
const isMouseDownTimeline = ref(false)
const isSeeking = ref(false)
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
  if (!isSeeking.value) {
    scrubbed.value = (currentTime.value / duration.value) * 100
  }
})

const onTimelineEnter = (e: MouseEvent) => {
  isMouseEnterTimeline.value = true
  document.addEventListener('mousemove', onMouseMove)
}

const onTimelineLeave = () => {
  isMouseEnterTimeline.value = false
  isSeeking.value = false
  seekedTime.value = 0
  if (isMouseDownTimeline.value) {
    isMouseDownTimeline.value = false
  }
  document.removeEventListener('mousemove', onMouseMove)
}

const onTimelineDown = () => {
  isMouseDownTimeline.value = true
  pause()
  seek(seekedTime.value)
}

const onTimelineUp = () => {
  isMouseDownTimeline.value = false
  isSeeking.value = false
  seek(seekedTime.value)
  play()
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
    isSeeking.value = true
    scrubbed.value = timeClamped
  }
}

const onTimelineResize = () => {
  timelineRect.value = timeline.value?.getBoundingClientRect()
  thumbPercentage.value =
    (timelineRect.value!.height / timelineRect.value!.width) * 100
}

onMounted(() => {
  onTimelineResize()
  window.addEventListener('resize', onTimelineResize, { passive: true })
})
</script>

<style lang="postcss">
.player-controls {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 2rem;
}

.player-controls__bar {
  position: relative;
  width: 100%;
  max-width: 480px;
  height: 2.5rem;
  padding: 0 1rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 999px;
  color: white;
  background-color: rgba(125, 125, 125, 0.25);
  backdrop-filter: blur(32px);
}

.player-controls__item {
  display: inline-flex;
  align-items: center;
  user-select: none;
}

.player-controls__item.-shrink {
  flex-shrink: 0;
}

.player-controls__item.-grow {
  flex-grow: 1;
}

.player-controls__item button {
  background-color: transparent;
  border: 0;
  outline: none;
  appearance: none;
  padding: 0 5px;
  color: white;
  cursor: pointer;
}

.player-controls__item button svg {
  display: block;
  width: 20px;
}

.player-controls__item time {
  font-size: 0.75rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.5);
}

.player-controls-btn {
  position: absolute;
  border: 0;
  outline: none;
  appearance: none;
  padding: 0;
  color: white;
  cursor: pointer;
  width: 4rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  backdrop-filter: blur(32px);
}

.player-controls-btn svg {
  display: block;
  width: 1.25rem;
}

.player-controls-btn--play {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
}

.player-controls-btn--mute {
  position: absolute;
  bottom: 1rem;
  right: calc(4rem + 1.5rem);
}

.player-controls-btn--fullscreen {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}

.player-timeline {
  position: relative;
  width: 100%;
  height: 2rem;
  display: flex;
  align-items: center;
}

.player-timeline:hover .player-progress-thumb {
  transform: scale(1);
}

.player-progress-track {
  position: relative;
  width: 100%;
  height: 2rem;
  background: rgba(250, 250, 205, 0.15);
  border-radius: 999px;
}

.player-progress-inner-track {
  position: relative;
  border-radius: 999px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 1;
}

.player-progress-thumb {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  margin-left: auto;
  border: 0.175rem currentColor solid;
  background: rgba(0, 0, 0, 0.25);
  z-index: 2;
  cursor: pointer;
  transform: scale(0);
  transform-origin: center;
  transition: transform cubic-bezier(0.65, 0, 0.35, 1) 0.3s;
}

.player-progress-scrubbed,
.player-progress-seeked,
.player-progress-buffered {
  position: absolute;
  left: 0;
  background: currentColor;
  height: 100%;
  border-radius: 999px;
}

.player-progress-scrubbed {
  z-index: 1;
  min-width: 2rem;
  display: flex;
}

.player-progress-seeked {
  opacity: 0.25;
}

.player-progress-buffered {
  opacity: 0.15;
}
</style>
