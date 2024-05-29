<template>
  <div class="magic-player-timeline">
    <div
      class="magic-player-timeline__target"
      @mouseenter="onMouseenter"
      @mouseleave="onMouseleave"
      @pointerdown="onPointerdown"
      @pointerup="onPointerup"
      @pointermove="onPointermove"
    >
      <div class="magic-player-timeline__slider-track">
        <div
          class="magic-player-timeline__slider-thumb"
          :style="{ left: `${scrubbedPercentage}%` }"
        >
          <div class="magic-player-timeline__slider-thumb-handle" />
        </div>
        <div class="magic-player-timeline__slider-inner-track">
          <div
            class="magic-player-timeline__slider-buffered"
            :style="{ left: `${bufferedPercentage}%` }"
          />
          <div
            v-show="mouseEntered"
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
  </div>
</template>

<script setup lang="ts">
import { usePlayerControlsApi } from '../composables/private/usePlayerControlsApi'

interface MagicPlayerTimelineProps {
  id: string
}

const props = defineProps<MagicPlayerTimelineProps>()

const {
  mouseEntered,
  seekedPercentage,
  scrubbedPercentage,
  bufferedPercentage,
  onMouseenter,
  onMouseleave,
  onPointerdown,
  onPointerup,
  onPointermove,
} = usePlayerControlsApi({
  id: props.id,
})
</script>

<style lang="css">
:root {
  --magic-player-target-height: 56px;
  --magic-player-track-height: 4px;
  --magic-player-track-background: rgba(250, 250, 250, 0.15);
  --magic-player-thumb-size: 1rem;
  --magic-player-thumb-background: rgba(250, 250, 250, 1);
}

.magic-player-timeline {
  position: relative;
  width: 100%;
  height: var(--magic-player-track-height);
  display: flex;
  align-items: center;
}

.magic-player-timeline__target {
  position: relative;
  width: 100%;
  height: var(--magic-player-target-height);
  display: flex;
  align-items: center;
  cursor: pointer;
}

.magic-player-timeline__slider-track {
  position: relative;
  width: 100%;
  height: var(--magic-player-track-height);
  background: var(--magic-player-track-background);
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
  transition: transform 300ms ease;
  z-index: 10;
  background-color: var(--magic-player-thumb-background);
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
