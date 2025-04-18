<template>
  <div class="magic-player-display-time">
    {{ stringifiedTime }}
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, toRefs } from 'vue'
import { formatTime } from '@maas/vue-equipment/utils'
import { usePlayerState } from '../composables/private/usePlayerState'

import { MagicPlayerInstanceId } from '../symbols'

interface MagicPlayerDisplayTimeProps {
  type?: 'current' | 'remaining' | 'duration'
}

const { type = 'current' } = defineProps<MagicPlayerDisplayTimeProps>()

const instanceId = inject(MagicPlayerInstanceId)

if (!instanceId) {
  throw new Error(
    'MagicPlayerDisplayTime must be nested inside MagicPlayerVideoControls or MagicPlayerAudioControls.'
  )
}

const { initializeState } = usePlayerState(instanceId)
const state = initializeState()
const { currentTime, duration } = toRefs(state)

const remainingTime = computed(() => duration.value - currentTime.value)

const stringifiedTime = computed(() => {
  switch (type) {
    case 'current':
      return formatTime(currentTime.value, currentTime.value)
    case 'remaining':
      return `-${formatTime(remainingTime.value, remainingTime.value)}`
    case 'duration':
      return formatTime(duration.value, duration.value)
    default:
      return ''
  }
})
</script>
