<template>
  <div class="magic-player-time-display">
    {{ stringifiedTime }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'
import { formatTime } from '@maas/vue-equipment/utils'

interface MagicPlayerDisplayTimeProps {
  id: string
  type: 'current' | 'remaining' | 'duration'
}

const props = withDefaults(defineProps<MagicPlayerDisplayTimeProps>(), {
  type: 'current',
})

const { currentTime, remainingTime, duration } = usePlayerMediaApi({
  id: props.id,
})

const stringifiedTime = computed(() => {
  switch (props.type) {
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
