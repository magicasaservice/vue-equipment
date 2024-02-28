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

const { currentTime } = usePlayerMediaApi({
  id: props.id,
})

function toNumber(value: string | number): number {
  return typeof value === 'string' ? parseFloat(value) : Number(value)
}

const formatTime = function (seconds: number, guide: number) {
  seconds = seconds < 0 ? 0 : seconds
  let s: string | number = Math.floor(seconds % 60)
  let m: string | number = Math.floor((seconds / 60) % 60)
  let h: string | number = Math.floor(seconds / 3600)
  const gm = Math.floor((guide / 60) % 60)
  const gh = Math.floor(guide / 3600)

  // handle invalid times
  if (isNaN(seconds) || seconds === Infinity) {
    // '-' is false for all relational operators (e.g. <, >=) so this setting
    // will add the minimum number of fields specified by the guide
    h = m = s = '-'
  }

  // Check if we need to show hours
  h = toNumber(h) > 0 || gh > 0 ? h + ':' : ''

  // If hours are showing, we may need to add a leading zero.
  // Always show at least one digit of minutes.
  m = ((h || gm >= 10) && toNumber(m) < 10 ? '0' + m : m) + ':'

  // Check if leading zero is need for seconds
  s = toNumber(s) < 10 ? '0' + s : s

  return h + m + s
}

const stringifiedTime = computed(() => formatTime(currentTime.value, 60))
</script>

<style>
:root {
  --magic-player-current-time-font-size: 0.875rem;
  --magic-player-current-time-color: inherit;
  --magic-player-current-time-width: 3.25rem;
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
