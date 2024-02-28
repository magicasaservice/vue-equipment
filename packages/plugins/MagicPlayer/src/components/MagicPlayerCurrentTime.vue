<template>
  <div class="magic-player-current-time">
    {{ stringifiedTime }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerMediaApi } from '../composables/private/usePlayerMediaApi'

interface Props {
  id: string
}

const props = defineProps<Props>()

const { formattedCurrentTime } = usePlayerMediaApi({
  id: props.id,
})

const hours = computed(() => {
  return formattedCurrentTime.value.hours
})

const minutes = computed(() => {
  return formattedCurrentTime.value.minutes || '0'
})

const seconds = computed(() => {
  return formattedCurrentTime.value.seconds
})

const stringifiedTime = computed(() => {
  let time = hours.value ? `${hours.value}:` : ''

  if (minutes.value.toString().length === 1) {
    time += `0${minutes.value}`
  } else {
    time += `${minutes.value}`
  }

  if (seconds.value.toString().length === 1) {
    time += `:0${seconds.value}`
  } else {
    time += `:${seconds.value}`
  }

  return time
})
</script>

<style>
:root {
  --magic-player-current-time-font-size: 0.875rem;
  --magic-player-current-time-color: inherit;
  --magic-player-current-time-width: 3.875rem;
  --magic-player-current-time-justify-content: flex-start;
}
.magic-player-current-time {
  height: 100%;
  width: var(--magic-player-current-time-width);
  font-size: var(--magic-player-current-time-font-size);
  color: var(--magic-player-current-time-color);
  display: flex;
  align-items: center;
  justify-content: var(--magic-player-current-time-justify-content);
}
</style>
