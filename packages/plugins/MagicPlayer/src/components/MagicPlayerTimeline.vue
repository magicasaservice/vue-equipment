<template>
  <div ref="track" class="magic-player-timeline">
    <div
      class="magic-player-timeline__target"
      @pointerdown="onPointerdown"
      @pointermove="onPointermove"
    >
      <div class="magic-player-timeline__track">
        <div
          class="magic-player-timeline__thumb"
          :style="{ left: `${scrubbedPercentage}%` }"
        >
          <div class="magic-player-timeline__thumb-handle" />
        </div>
        <div class="magic-player-timeline__inner-track">
          <div
            class="magic-player-timeline__buffered"
            :style="{ left: `${bufferedPercentage}%` }"
          />
          <div
            v-show="controlsMouseEntered"
            class="magic-player-timeline__seeked"
            :style="{ left: `${seekedPercentage}%` }"
          />
          <div
            class="magic-player-timeline__scrubbed"
            :style="{ left: `${scrubbedPercentage}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, toRefs } from 'vue'
import { usePlayerControlsApi } from '../composables/private/usePlayerControlsApi'
import { usePlayerState } from '../composables/private/usePlayerState'
import {
  MagicPlayerInstanceId,
  MagicPlayerTrackRef,
  MagicPlayerPopoverRef,
  MagicPlayerBarRef,
} from '../symbols'

const instanceId = inject(MagicPlayerInstanceId, undefined)

if (!instanceId) {
  throw new Error(
    'MagicPlayerTimeline must be nested inside MagicPlayerVideoControls or MagicPlayerAudioControls.'
  )
}

const { initializeState } = usePlayerState(instanceId)
const state = initializeState()
const { controlsMouseEntered, seekedPercentage, scrubbedPercentage } =
  toRefs(state)

const barRef = inject(MagicPlayerBarRef)
const trackRef = inject(MagicPlayerTrackRef)
const popoverRef = inject(MagicPlayerPopoverRef, undefined)

const { bufferedPercentage, onPointerdown, onPointermove } =
  usePlayerControlsApi({
    id: instanceId,
    barRef,
    trackRef,
    popoverRef,
  })
</script>
