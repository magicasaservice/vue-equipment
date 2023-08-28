<template>
  <div>
    <div>{{ years }} Year(s)</div>
    <div>{{ days }} Day(s)</div>
    <div>{{ hours }} Hour(s)</div>
    <div>{{ minutes }} Minute(s)</div>
    <div>{{ seconds }} Second(s)</div>
  </div>
</template>

<script lang="ts" setup>
import { useCountdown } from '@maas/vue-equipment/composables'
const { years, days, hours, minutes, seconds } = useCountdown(
  {
    endDate: '2024-01-01',
    endTime: '00:00:00',
    timezone: 'Europe/Berlin',
  },
  () => {
    console.log('Countdown finished!')
  },
)
</script>
