<template>
  <div v-show="isVisible" class="magic-player-poster">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { inject, toRefs, computed } from 'vue'
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
const { loaded, started } = toRefs(state)

const isVisible = computed(() => {
  return !loaded.value || !started.value
})
</script>

<style>
.magic-player-poster {
  position: absolute;
  inset: 0;
}
</style>
