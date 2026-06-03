<template>
  <div
    ref="player"
    class="magic-player-provider"
    :data-id="id"
    :data-mode="state.options.mode"
    :data-fullscreen="fullscreen"
    :data-touched="touched"
    :data-playing="playing"
    :data-paused="paused"
    :data-started="started"
    :data-waiting="waiting"
    :data-loaded="loaded"
    :data-muted="muted"
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
  useTemplateRef,
  computed,
  watch,
  type MaybeRef,
} from 'vue'

import { usePlayerState } from '../composables/private/usePlayerState'
import { usePlayerPlaylistApi } from '../composables/private/usePlayerPlaylistApi'

import {
  MagicPlayerInstanceId,
  MagicPlayerOptionsKey,
  MagicPlayerRef,
  MagicPlayerCurrentSrcKey,
} from '../symbols'

import type { MagicPlayerOptions } from '../types'
import { usePlayerEmitter } from '../composables/private/usePlayerEmitter'
import { usePlayerProvider } from '../composables/private/usePlayerProvider'

interface MagicPlayerProps {
  id: MaybeRef<string>
  options?: MagicPlayerOptions
}

const { id, options } = defineProps<MagicPlayerProps>()

const { initializeState } = usePlayerState(id)
const state = initializeState(options)
const {
  playing,
  paused,
  started,
  waiting,
  muted,
  loaded,
  fullscreen,
  touched,
} = toRefs(state)

// Normalize src into an array and set playlist state
const rawSrc = options?.src ?? ''
const srcs = Array.isArray(rawSrc) ? rawSrc : [rawSrc]
state.playlistCount = srcs.length
state.loop = state.options.loop

const currentSrc = computed(() => srcs[state.playlistIndex] ?? '')

const { next } = usePlayerPlaylistApi({ id })

// Auto-advance to next track when the current track ends
watch(
  () => state.ended,
  (value) => {
    if (value && state.playlistCount > 1) {
      next()
    }
  }
)

const { onMouseenter, onMouseleave, onPointerdown } = usePlayerProvider(id)

// Lifecycle hooks
const playerRef = useTemplateRef('player')
const { initializeEmitter } = usePlayerEmitter({ id })

onMounted(() => {
  initializeEmitter()
})

provide(MagicPlayerInstanceId, id)
provide(MagicPlayerOptionsKey, state.options)
provide(MagicPlayerRef, playerRef)
provide(MagicPlayerCurrentSrcKey, currentSrc)
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
