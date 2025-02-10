<template>
  <div
    ref="playerRef"
    class="magic-player-provider"
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
import { ref, provide, type MaybeRef } from 'vue'
import defu from 'defu'

import { usePlayerVideoApi } from '../composables/private/usePlayerVideoApi'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { usePlayerRuntime } from '../composables/private/usePlayerRuntime'

import { MagicPlayerInstanceId, MagicPlayerOptionsKey } from '../symbols'
import { defaultOptions } from '../utils/defaultOptions'

import type { MagicPlayerOptions } from '../types'

interface MagicPlayerProps {
  id: MaybeRef<string>
  options?: MagicPlayerOptions
}

const { id, options } = defineProps<MagicPlayerProps>()
const mappedOptions = defu(options, defaultOptions)

const playerRef = ref<HTMLDivElement | undefined>(undefined)

const { playing, waiting, muted } = usePlayerMediaApi({
  id: id,
})

const { loaded } = usePlayerRuntime({
  id: id,
  src: mappedOptions.src,
  srcType: mappedOptions.srcType,
})

const { onMouseenter, onMouseleave, isFullscreen, touched } = usePlayerVideoApi(
  {
    id: id,
    playerRef: playerRef,
  }
)

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
