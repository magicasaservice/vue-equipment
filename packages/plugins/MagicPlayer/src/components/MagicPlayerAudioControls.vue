<template>
  <div
    class="magic-player-audio-controls"
    :data-touched="touched"
    :data-playing="playing"
    :data-paused="!playing"
    :data-waiting="waiting"
    :data-idle="idle"
    :data-hover="mouseEntered"
  >
    <div class="magic-player-audio-controls__bar">
      <div ref="bar" class="magic-player-audio-controls__bar--inner">
        <div
          class="magic-player-audio-controls__item -shrink-0"
          data-slot="play-toggle"
        >
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
        <div
          class="magic-player-audio-controls__item -shrink-0"
          data-slot="display-time-current"
        >
          <magic-player-display-time type="current" />
        </div>
        <div
          class="magic-player-audio-controls__item -grow"
          data-slot="timeline"
        >
          <div ref="track" class="magic-player-audio-controls__timeline">
            <magic-player-timeline />
          </div>
        </div>
        <div
          class="magic-player-audio-controls__item -shrink-0"
          data-slot="display-time-duration"
        >
          <magic-player-display-time type="duration" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, provide, useTemplateRef } from 'vue'
import { useIdle } from '@vueuse/core'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { usePlayerAudioApi } from '../composables/private/usePlayerAudioApi'
import { usePlayerControlsApi } from '../composables/private/usePlayerControlsApi'
import IconPlay from './icons/Play.vue'
import IconPause from './icons/Pause.vue'
import { MagicPlayerInstanceId } from '../symbols'

interface MagicAudioPlayerControlsProps {
  id?: string
}

const { id } = defineProps<MagicAudioPlayerControlsProps>()

const instanceId = inject(MagicPlayerInstanceId, undefined)
const mappedId = computed(() => id ?? instanceId)

if (!mappedId.value) {
  throw new Error(
    'MagicAudioPlayerControls must be nested inside MagicAudioPlayer or be passed an id as a prop.'
  )
}

const barRef = useTemplateRef('bar')
const trackRef = useTemplateRef('track')

const { playing, waiting } = usePlayerMediaApi({
  id: mappedId.value,
})

const { play, pause, touched, mouseEntered } = usePlayerAudioApi({
  id: mappedId.value,
})

usePlayerControlsApi({
  id: mappedId.value,
  barRef: barRef,
  trackRef: trackRef,
})

const { idle } = useIdle(3000)

provide(MagicPlayerInstanceId, mappedId.value)
</script>
