<template>
  <div v-show="isVisible" class="magic-player-poster">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { inject, toRefs, computed } from 'vue'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { usePlayerState } from '../composables/private/usePlayerState'
import { MagicPlayerInstanceId } from '../symbols'

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicPlayer',
  source: 'MagicPlayer',
})

const instanceId = inject(MagicPlayerInstanceId, undefined)

magicError.assert(instanceId, {
  message: 'MagicPlayerPoster must be nested inside MagicPlayerProvider.',
  statusCode: 400,
})

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
