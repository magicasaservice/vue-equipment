<template>
  <div
    v-show="!loaded || !started || (hasOverlay && !touched)"
    class="magic-player-poster"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { inject, toRefs } from 'vue'
import { usePlayerState } from '../composables/private/usePlayerState'
import { MagicPlayerInstanceId } from '../symbols'

const instanceId = inject(MagicPlayerInstanceId, undefined)

if (!instanceId) {
  throw new Error(
    'MagicPlayerPoster must be nested inside MagicPlayerProvider.'
  )
}

const { initializeState } = usePlayerState(instanceId)
const state = initializeState()
const { loaded, started, hasOverlay, touched } = toRefs(state)
</script>

<style>
.magic-player-poster {
  position: absolute;
  inset: 0;
}
</style>
