<template>
  <audio ref="el" class="magic-player-audio" />
</template>

<script lang="ts" setup>
import {
  toRefs,
  useTemplateRef,
  inject,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import {
  useElementVisibility,
  useEventListener,
  defaultWindow,
} from '@vueuse/core'
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
const isVisible = useElementVisibility(elRef)

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

usePlayerAudioApi({
  id: injectedInstanceId,
})

const { initializeState } = usePlayerState(injectedInstanceId)
const state = initializeState()
const { playing, paused, started, ended } = toRefs(state)

// Autoplay when window is focused, video has not been paused manually,
// has autoplay enabled or has started playing and not ended.
// Set playing state directly to avoid influencing paused state.
function onWindowFocus() {
  if (
    isVisible.value &&
    !playing.value &&
    !paused.value &&
    (injectedOptions?.autoplay || (started.value && !ended.value))
  ) {
    playing.value = true
  }
}

useEventListener(defaultWindow, 'focus', onWindowFocus)

// Autoplay when element is visible, has not been paused manually,
// has autoplay enabled or has started playing and not ended.
// Set playing state directly to avoid influencing paused state.
watch(
  isVisible,
  (value) => {
    if (!value && playing.value) {
      playing.value = false
    }

    if (
      value &&
      !playing.value &&
      !paused.value &&
      (injectedOptions.autoplay || (started.value && !ended.value))
    ) {
      playing.value = true
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
