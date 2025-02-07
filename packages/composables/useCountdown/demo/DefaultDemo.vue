<template>
  <div class="flex w-full flex-col gap-4">
    <div
      v-if="years || years === 0"
      class="type-surface-body-sm text-surface-subtle flex flex-col items-center gap-2"
    >
      <m-badge>{{ years }} Year{{ years !== 1 ? 's' : '' }}</m-badge>
      <m-badge>{{ days }} Day{{ days !== 1 ? 's' : '' }}</m-badge>
      <m-badge>{{ hours }} Hour{{ hours !== 1 ? 's' : '' }}</m-badge>
      <m-badge>{{ minutes }} Minute{{ minutes !== 1 ? 's' : '' }}</m-badge>
      <m-badge>{{ seconds }} Second{{ seconds !== 1 ? 's' : '' }}</m-badge>
      <span class="pt-4">until {{ nextYear }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { MBadge } from '@maas/mirror/vue'
import {
  useCountdown,
  type DateTimeArray,
} from '@maas/vue-equipment/composables'

const nextYear = computed(() => new Date().getFullYear() + 1)
const refDate = ref(`${nextYear.value}-01-01 00:00:00`)

const refDateArray = computed<DateTimeArray>(() => {
  const date = new Date(refDate.value)
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ]
})

const { years, days, hours, minutes, seconds } = useCountdown({
  endDateTime: refDateArray,
  timezone: 'Europe/Berlin',
})
</script>
