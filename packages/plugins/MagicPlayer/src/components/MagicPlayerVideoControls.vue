<template>
  <div
    class="magic-player-video-controls"
    :data-fullscreen="fullscreen"
    :data-touched="touched"
    :data-dragging="dragging"
    :data-started="started"
    :data-playing="playing"
    :data-paused="paused"
    :data-waiting="waiting"
    :data-muted="muted"
    :data-idle="idle"
    :data-hover="controlsMouseEntered"
    :data-standalone="standalone"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <transition :name="mappedTransition">
      <div v-show="visible" class="magic-player-video-controls__bar">
        <div
          v-if="$slots.popover && seekedTime !== null && seekedTime >= 0"
          ref="popover"
          class="magic-player-video-controls__popover"
          :style="{
            marginLeft: `${popoverOffsetX}%`,
          }"
        >
          <div v-show="popoverOffsetX !== null">
            <slot name="popover" />
          </div>
        </div>
        <div ref="bar" class="magic-player-video-controls__bar--inner">
          <div class="magic-player-video-controls__item -shrink-0">
            <button v-if="paused || !started" @click="play">
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
            <div
              ref="track"
              class="magic-player-video-controls__timeline"
              @mouseleave="onMouseleaveTimeline"
            >
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
            <button v-if="fullscreen" @click="exitFullscreen">
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
import {
  toRefs,
  computed,
  inject,
  provide,
  useTemplateRef,
  onBeforeUnmount,
} from 'vue'
import { useIdle } from '@vueuse/core'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import IconPlay from './icons/Play.vue'
import IconPause from './icons/Pause.vue'
import IconVolumeOn from './icons/VolumeOn.vue'
import IconVolumeOff from './icons/VolumeOff.vue'
import IconFullscreenEnter from './icons/FullscreenEnter.vue'
import IconFullscreenExit from './icons/FullscreenExit.vue'
import { usePlayerState } from '../composables/private/usePlayerState'
import { usePlayerVideoApi } from '../composables/private/usePlayerVideoApi'
import { usePlayerControlsApi } from '../composables/private/usePlayerControlsApi'
import {
  MagicPlayerInstanceId,
  MagicPlayerOptionsKey,
  MagicPlayerTrackRef,
  MagicPlayerPopoverRef,
  MagicPlayerBarRef,
} from '../symbols'

import '@maas/vue-equipment/utils/css/keyframes/fade-up-in.css'
import '@maas/vue-equipment/utils/css/keyframes/fade-up-out.css'

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

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicPlayer',
  source: 'MagicPlayer',
})

const injectedInstanceId = inject(MagicPlayerInstanceId, undefined)
const injectedOptions = inject(MagicPlayerOptionsKey, undefined)

const mappedInstanceId = computed(() => id ?? injectedInstanceId)

magicError.assert(mappedInstanceId.value, {
  message:
    'MagicPlayerVideoControls must be nested inside MagicPlayerProvider or be passed an id as a prop.',
  errorCode: 'missing_instance_id',
})

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
  started,
  paused,
  waiting,
  muted,
  touched,
  mouseEntered,
  controlsMouseEntered,
  fullscreen,
  popoverOffsetX,
  hasOverlay,
  seekedTime,
  dragging,
} = toRefs(state)

const { play, pause, mute, unmute, enterFullscreen, exitFullscreen } =
  usePlayerVideoApi({ id: mappedInstanceId.value })

const {
  initialize,
  destroy,
  onMouseenter,
  onMouseleave,
  onMouseleaveTimeline,
} = usePlayerControlsApi({
  id: mappedInstanceId.value,
  barRef: barRef,
  trackRef: trackRef,
  popoverRef: popoverRef,
})

const { idle } = useIdle(injectedOptions?.threshold?.idle)

const visible = computed(() => {
  switch (true) {
    case standalone:
      return true
    case hasOverlay.value && !started.value:

    case playing.value && idle.value:
    case playing.value && !mouseEntered.value && !controlsMouseEntered.value:

    case injectedOptions?.autoplay && !started.value:
    case injectedOptions?.autoplay && !mouseEntered.value:
    case injectedOptions?.autoplay && !mouseEntered.value && !touched.value:
      return false
    default:
      return true
  }
})

// Lifecycle hooks
initialize()

onBeforeUnmount(() => {
  destroy()
})

provide(MagicPlayerInstanceId, mappedInstanceId.value)
provide(MagicPlayerTrackRef, trackRef)
provide(MagicPlayerPopoverRef, popoverRef)
provide(MagicPlayerBarRef, barRef)
</script>
