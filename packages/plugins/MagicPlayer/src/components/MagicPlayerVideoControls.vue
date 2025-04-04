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
    :data-hover="controlsMouseEntered"
    :data-standalone="standalone"
  >
    <transition :name="mappedTransition">
      <div v-show="!hidden" class="magic-player-video-controls__bar">
        <div
          v-if="$slots.popover"
          v-show="!!seekedTime && touched"
          ref="popover"
          class="magic-player-video-controls__popover"
          :style="{ marginLeft: `${popoverOffsetX}%` }"
        >
          <slot name="popover" />
        </div>
        <div ref="bar" class="magic-player-video-controls__bar--inner">
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
            <div ref="track" class="magic-player-video-controls__timeline">
              <magic-player-timeline />
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
import { toRefs, computed, inject, provide, useTemplateRef } from 'vue'
import { useIdle } from '@vueuse/core'
import IconPlay from './icons/Play.vue'
import IconPause from './icons/Pause.vue'
import IconVolumeOn from './icons/VolumeOn.vue'
import IconVolumeOff from './icons/VolumeOff.vue'
import IconFullscreenEnter from './icons/FullscreenEnter.vue'
import IconFullscreenExit from './icons/FullscreenExit.vue'
import { usePlayerState } from '../composables/private/usePlayerState'
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

const injectedInstanceId = inject(MagicPlayerInstanceId, undefined)
const mappedInstanceId = computed(() => id ?? injectedInstanceId)

if (!mappedInstanceId.value) {
  throw new Error(
    'MagicPlayerVideoControls must be nested inside MagicPlayerProvider or be passed an id as a prop.'
  )
}

const injectedOptions = inject(MagicPlayerOptionsKey, undefined)

const mappedTransition = computed(
  () => transition ?? injectedOptions?.transition?.videoControls
)

const barRef = useTemplateRef('bar')
const trackRef = useTemplateRef('track')
const popoverRef = useTemplateRef('popover')

const { initializeState } = usePlayerState(mappedInstanceId.value)
const state = initializeState()
const {
  playing,
  waiting,
  muted,
  touched,
  videoMouseEntered,
  controlsMouseEntered,
  isFullscreen,
  popoverOffsetX,
  seekedTime,
} = toRefs(state)

const { play, pause, mute, unmute, enterFullscreen, exitFullscreen } =
  usePlayerVideoApi({ id: mappedInstanceId.value })

usePlayerControlsApi({
  id: mappedInstanceId.value,
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
    case playing.value &&
      !controlsMouseEntered.value &&
      !videoMouseEntered.value:
      return true
    case !touched.value:
      return true
    default:
      return false
  }
})

provide(MagicPlayerInstanceId, mappedInstanceId.value)
</script>
