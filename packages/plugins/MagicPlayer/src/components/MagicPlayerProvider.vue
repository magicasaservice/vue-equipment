<template>
  <div
    ref="player"
    class="magic-player-provider"
    :data-id="id"
    :data-mode="mappedOptions.mode"
    :data-fullscreen="fullscreen"
    :data-touched="touched"
    :data-playing="playing"
    :data-paused="paused"
    :data-started="started"
    :data-waiting="waiting"
    :data-loaded="loaded"
    :data-muted="muted"
    @touchstart="onTouchstart"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
    @pointerdown="onPointerdown"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {
  toRefs,
  provide,
  onMounted,
  onUnmounted,
  useTemplateRef,
  type MaybeRef,
} from 'vue'
import defu from 'defu'

import { usePlayerState } from '../composables/private/usePlayerState'

import {
  MagicPlayerInstanceId,
  MagicPlayerOptionsKey,
  MagicPlayerRef,
} from '../symbols'
import { defaultOptions } from '../utils/defaultOptions'

import type { MagicPlayerOptions } from '../types'
import { usePlayerEmitter } from '../composables/private/usePlayerEmitter'
import { usePlayerProvider } from '../composables/private/usePlayerProvider'

interface MagicPlayerProps {
  id: MaybeRef<string>
  options?: MagicPlayerOptions
}

const { id, options } = defineProps<MagicPlayerProps>()
const mappedOptions = defu(options, defaultOptions)

const { initializeState, deleteState } = usePlayerState(id)
const state = initializeState()
const {
  playing,
  paused,
  started,
  waiting,
  muted,
  loaded,
  fullscreen,
  touched,
  // mouseEntered,
} = toRefs(state)

const { onTouchstart, onMouseenter, onMouseleave, onPointerdown } =
  usePlayerProvider(id)

// Lifecycle hooks
const playerRef = useTemplateRef('player')
const { initializeEmitter } = usePlayerEmitter({ id })

onMounted(() => {
  initializeEmitter()
})

onUnmounted(() => {
  deleteState()
})

provide(MagicPlayerInstanceId, id)
provide(MagicPlayerOptionsKey, mappedOptions)
provide(MagicPlayerRef, playerRef)
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
