<template>
  <div v-show="!loaded || !touched" class="magic-player-poster">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { usePlayerRuntime } from '../composables/private/usePlayerRuntime'
import { usePlayerVideoApi } from '../composables/private/usePlayerVideoApi'
import { MagicPlayerInstanceId } from '../symbols'

const instanceId = inject(MagicPlayerInstanceId, undefined)

if (!instanceId) {
  throw new Error(
    'MagicPlayerPoster must be nested inside MagicPlayerProvider.'
  )
}

const { loaded } = usePlayerRuntime({
  id: instanceId,
})

const { touched } = usePlayerVideoApi({
  id: instanceId,
})
</script>

<style>
.magic-player-poster {
  position: absolute;
  inset: 0;
}
</style>
