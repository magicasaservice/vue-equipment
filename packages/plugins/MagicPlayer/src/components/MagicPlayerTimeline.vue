<template>
  <div
    class="magic-player-timeline"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointermove="onPointerMove"
  >
    <div
      v-show="!!seekedTime"
      class="magic-player-timeline__seek-popover"
      :style="{ left: `${seekedPercentage}%` }"
    >
      <slot name="seekPopover" :seeked-time="seekedTime" />
    </div>
    <div ref="trackRef" class="magic-player-timeline__slider-track">
      <div
        class="magic-player-timeline__slider-thumb"
        :style="{ left: `${scrubbedPercentage}%` }"
      >
        <div class="magic-player-timeline__slider-thumb-handle"></div>
      </div>
      <div class="magic-player-timeline__slider-inner-track">
        <div
          class="magic-player-timeline__slider-buffered"
          :style="{ left: `${bufferedPercentage}%` }"
        />
        <div
          v-show="entered"
          class="magic-player-timeline__slider-seeked"
          :style="{ left: `${seekedPercentage}%` }"
        />
        <div
          class="magic-player-timeline__slider-scrubbed"
          :style="{ left: `${scrubbedPercentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'
import { MediaApiInjectionKey, PlayerApiInjectionKey } from './../types'
import { useResizeObserver, useEventListener } from '@vueuse/core'
import { clampValue, mapValue } from './../utils'
import { defaultWindow } from '@vueuse/core'

const { duration, currentTime, playing, buffered } =
  inject(MediaApiInjectionKey)!

const { play, pause, seek, touched } = inject(PlayerApiInjectionKey)!

const trackRef = ref<HTMLDivElement | undefined>(undefined)
const trackRect = ref<DOMRect | undefined>(undefined)
const entered = ref(false)
const dragging = ref(false)
const seekedTime = ref(0)
const seekedPercentage = ref(0)
const scrubbedPercentage = ref(0)
const thumbPercentage = ref(0)
const resumePlay = ref(false)

const bufferedPercentage = computed(() => {
  const endBuffer = buffered.value.length > 0 ? buffered.value[0][1] : 0
  const percentage = (endBuffer / duration.value) * 100
  return clampValue(percentage, 0, thumbPercentage.value)
})

watch(currentTime, (value) => {
  const percentage = (value / duration.value) * 100
  scrubbedPercentage.value = mapValue(
    percentage,
    0,
    100,
    0,
    thumbPercentage.value
  )
})

const onMouseEnter = () => {
  getTimelineTrackSize()
  entered.value = true
}

const onMouseLeave = () => {
  entered.value = false
  dragging.value = false
  seekedTime.value = 0
}

const onPointerDown = (e: MouseEvent | TouchEvent) => {
  dragging.value = true
  resumePlay.value = playing.value
  pause()
  const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX
  seekToTrackPosition(x)
}

const onPointerUp = () => {
  dragging.value = false
  if (resumePlay.value) {
    play()
  }
}

const onPointerMove = (e: MouseEvent | TouchEvent) => {
  const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX
  seekToTrackPosition(x)
}

const seekToTrackPosition = (absX: number) => {
  const relX = absX - trackRect.value!.x - trackRect.value!.height / 2
  const percentage = Math.round((relX / trackRect.value!.width) * 100)

  seekedPercentage.value = clampValue(percentage, 0, thumbPercentage.value)

  seekedTime.value =
    (duration.value *
      mapValue(seekedPercentage.value, 0, thumbPercentage.value, 0, 100)) /
    100

  if (dragging.value) {
    scrubbedPercentage.value = seekedPercentage.value
    seek(seekedTime.value)
  }
}

const getTimelineTrackSize = () => {
  trackRect.value = trackRef.value?.getBoundingClientRect()
  thumbPercentage.value =
    100 - (trackRect.value!.height / trackRect.value!.width) * 100
}

useResizeObserver(trackRef, getTimelineTrackSize)
useEventListener(defaultWindow, 'resize', getTimelineTrackSize, {
  passive: true,
})
</script>

<style lang="postcss">
:root {
  --magic-player-timeline-height: 40px;
  --magic-player-track-height: 4px;
  --magic-player-track-bg-color: rgba(250, 250, 250, 0.15);
  --magic-player-thumb-size: 1rem;
  --magic-player-thumb-bg-color: rgba(250, 250, 250, 1);
}

.magic-player-timeline {
  position: relative;
  width: 100%;
  height: var(--magic-player-timeline-height);
  display: flex;
  align-items: center;
  cursor: pointer;
}

.magic-player-timeline__slider-track {
  position: relative;
  width: 100%;
  height: var(--magic-player-track-height);
  background: var(--magic-player-track-bg-color);
  border-radius: 50rem;
}

.magic-player-timeline__slider-inner-track {
  position: relative;
  border-radius: 50rem;
  overflow: hidden;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

.magic-player-timeline__slider-thumb {
  position: absolute;
  width: var(--magic-player-track-height);
  height: var(--magic-player-track-height);
  z-index: 10;
}

.magic-player-timeline__slider-thumb-handle {
  position: absolute;
  width: var(--magic-player-thumb-size);
  height: var(--magic-player-thumb-size);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 300ms ease-out;
  z-index: 10;
  background-color: var(--magic-player-thumb-bg-color);
  border-radius: 50rem;
}
.magic-player-timeline__slider-scrubbed,
.magic-player-timeline__slider-seeked,
.magic-player-timeline__slider-buffered {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  margin-left: calc(-100% + var(--magic-player-track-height));
  background: currentColor;
  border-radius: 50rem;
}

.magic-player-timeline__slider-scrubbed {
  z-index: 1;
  min-width: var(--magic-player-track-height);
  display: flex;
}

.magic-player-timeline__slider-seeked {
  opacity: 0.25;
}

.magic-player-timeline__slider-buffered {
  opacity: 0.15;
}

.magic-player-timeline:hover .magic-player-timeline__slider-thumb-handle {
  transform: translate(-50%, -50%) scale(1);
}

.magic-player-timeline__seek-popover {
  position: absolute;
  left: 0;
  bottom: 100%;
  transform: translateX(-50%);
}
</style>
