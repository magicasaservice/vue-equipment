<template>
  <div
    ref="player"
    class="magic-player-provider"
    :data-id="id"
    :data-mode="mappedOptions.mode"
    :data-fullscreen="isFullscreen"
    :data-touched="touched"
    :data-playing="playing"
    :data-paused="!playing"
    :data-waiting="waiting"
    :data-loaded="loaded"
    :data-muted="muted"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { toRefs, provide, type MaybeRef, onUnmounted } from 'vue'
import defu from 'defu'

import { usePlayerState } from '../composables/private/usePlayerState'

import { MagicPlayerInstanceId, MagicPlayerOptionsKey } from '../symbols'
import { defaultOptions } from '../utils/defaultOptions'

import type { MagicPlayerOptions } from '../types'

interface MagicPlayerProps {
  id: MaybeRef<string>
  options?: MagicPlayerOptions
}

const { id, options } = defineProps<MagicPlayerProps>()
const mappedOptions = defu(options, defaultOptions)

const { initializeState, deleteState } = usePlayerState(id)
const state = initializeState()
const { playing, waiting, muted, loaded, isFullscreen, touched, mouseEntered } =
  toRefs(state)

function onMouseenter() {
  mouseEntered.value = true
}

function onMouseleave() {
  mouseEntered.value = false
}

onUnmounted(() => {
  deleteState()
})

provide(MagicPlayerInstanceId, id)
provide(MagicPlayerOptionsKey, mappedOptions)
</script>

<style>
.magic-player-provider {
  position: relative;
  width: 100%;
}

.magic-player-provider[data-mode='video'] {
  overflow: hidden;
  height: var(--magic-player-provider-height, auto);
  aspect-ratio: var(--magic-player-provider-aspect-ratio, 16 / 9);
  background: var(--magic-player-provider-background, #000);
}

.magic-player-provider[data-loaded='true'][data-mode='video'] {
  --magic-player-provider-background: transparent;
}

.magic-player-provider[data-mode='audio'] {
  position: relative;
  width: 100%;
}
</style>
