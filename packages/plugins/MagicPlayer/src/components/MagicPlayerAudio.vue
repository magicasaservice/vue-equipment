<template>
  <audio ref="el" class="magic-player-audio" />
</template>

<script lang="ts" setup>
import {
  toRefs,
  useTemplateRef,
  shallowRef,
  inject,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { usePlayerAudioApi } from '../composables/private/usePlayerAudioApi'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { usePlayerRuntime } from '../composables/private/usePlayerRuntime'
import { usePlayerState } from '../composables/private/usePlayerState'

import { MagicPlayerInstanceId, MagicPlayerOptionsKey } from '../symbols'

const injectedInstanceId = inject(MagicPlayerInstanceId, undefined)
const injectedOptions = inject(MagicPlayerOptionsKey, undefined)

if (!injectedInstanceId) {
  throw new Error('MagicPlayerVideo must be used within a MagicPlayerProvider')
}

if (!injectedOptions) {
  throw new Error('MagicPlayerVideo must be used within a MagicPlayerProvider')
}

const elRef = useTemplateRef('el')

const pausedByIntersection = shallowRef(false)

const { initialize, destroy } = usePlayerRuntime({
  id: injectedInstanceId,
  mediaRef: elRef,
  src: injectedOptions.src,
  srcType: injectedOptions.srcType,
})

usePlayerMediaApi({
  id: injectedInstanceId,
  mediaRef: elRef,
})

const { play, pause } = usePlayerAudioApi({
  id: injectedInstanceId,
})

const { initializeState } = usePlayerState(injectedInstanceId)
const state = initializeState()
const { playing } = toRefs(state)

useIntersectionObserver(
  elRef,
  ([{ isIntersecting }]) => {
    if (!isIntersecting && playing.value) {
      pause()
      pausedByIntersection.value = true
    } else if (isIntersecting && !playing.value && pausedByIntersection.value) {
      pausedByIntersection.value = false

      play()
    }
  },
  {
    immediate: true,
  }
)

onMounted(() => {
  initialize()
})

onBeforeUnmount(() => {
  destroy()
})
</script>

<style>
.magic-player-audio {
  width: 100%;
}
</style>
