<template>
  <div class="magic-player-time-display">
    {{ stringifiedTime }}
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { formatTime } from '@maas/vue-equipment/utils'
import { MagicPlayerInstanceId } from '../symbols'

interface MagicPlayerDisplayTimeProps {
  type?: 'current' | 'remaining' | 'duration'
}

const { type = 'current' } = defineProps<MagicPlayerDisplayTimeProps>()

const instanceId = inject(MagicPlayerInstanceId)

if (!instanceId) {
  throw new Error(
    'MagicPlayerDisplayTime must be nested inside MagicPlayerControls or MagicPlayerAudioControls.'
  )
}

const { currentTime, remainingTime, duration } = usePlayerMediaApi({
  id: instanceId,
})

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

<style>
.magic-player-time-display {
  height: 100%;
  width: var(--magic-player-time-display-width, 4rem);
  font-size: var(--magic-player-time-display-font-size, 0.875rem);
  color: var(--magic-player-time-display-color, inherit);
  display: flex;
  align-items: center;
  justify-content: var(--magic-player-time-display-justify-content, center);
  font-variant-numeric: var(
    --magic-player-time-display-font-variant-numeric,
    tabular-nums
  );
}
</style>
