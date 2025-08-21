<template>
  <div
    class="magic-player-audio-controls"
    :data-touched="touched"
    :data-dragging="dragging"
    :data-started="started"
    :data-playing="playing"
    :data-paused="paused"
    :data-waiting="waiting"
    :data-muted="muted"
    :data-idle="idle"
    :data-hover="controlsMouseEntered"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
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
          <div
            ref="track"
            class="magic-player-audio-controls__timeline"
            @mouseleave="onMouseleaveTimeline"
          >
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
import { usePlayerState } from '../composables/private/usePlayerState'
import { usePlayerAudioApi } from '../composables/private/usePlayerAudioApi'
import { usePlayerControlsApi } from '../composables/private/usePlayerControlsApi'
import IconPlay from './icons/Play.vue'
import IconPause from './icons/Pause.vue'
import {
  MagicPlayerInstanceId,
  MagicPlayerOptionsKey,
  MagicPlayerTrackRef,
  MagicPlayerBarRef,
} from '../symbols'

interface MagicAudioPlayerControlsProps {
  instanceId?: string
}

const { instanceId } = defineProps<MagicAudioPlayerControlsProps>()

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicPlayer',
  source: 'MagicPlayerAudioControls',
})

const injectedInstanceId = inject(MagicPlayerInstanceId, undefined)
const injectedOptions = inject(MagicPlayerOptionsKey, undefined)

const mappedInstanceId = computed(() => instanceId ?? injectedInstanceId)

magicError.assert(mappedInstanceId.value, {
  message:
    'MagicAudioPlayerControls must be nested inside MagicAudioPlayer or an instanceId must be provided',
  errorCode: 'missing_instance_id',
})

const barRef = useTemplateRef('bar')
const trackRef = useTemplateRef('track')

const { play, pause } = usePlayerAudioApi({
  id: mappedInstanceId.value,
})

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
})

const { initializeState } = usePlayerState(mappedInstanceId.value)
const state = initializeState()
const {
  playing,
  paused,
  started,
  muted,
  waiting,
  touched,
  dragging,
  controlsMouseEntered,
} = toRefs(state)

const { idle } = useIdle(injectedOptions?.threshold?.idle)

// Lifecycle hooks
initialize()

onBeforeUnmount(() => {
  destroy()
})

provide(MagicPlayerInstanceId, mappedInstanceId.value)
provide(MagicPlayerTrackRef, trackRef)
provide(MagicPlayerBarRef, barRef)
</script>
