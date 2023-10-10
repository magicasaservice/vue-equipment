# useCountdown

A composable function that returns the remaining time until a given Date and Time.

## Usage

```vue
<template>
  <div class="w-full flex gap-4">
    <div>
      <input type="datetime" v-model="refDate" />
    </div>
    <div>
      <div>{{ years }} Year(s)</div>
      <div>{{ days }} Day(s)</div>
      <div>{{ hours }} Hour(s)</div>
      <div>{{ minutes }} Minute(s)</div>
      <div>{{ seconds }} Second(s)</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  useCountdown,
  type DateTimeArray,
} from '@maas/vue-equipment/composables'
import { computed } from 'vue'

const refDate = ref('2025-01-01 00:00:00')

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

const { years, days, hours, minutes, seconds } = useCountdown(
  {
    endDateTime: refDateArray,
    timezone: 'Europe/Berlin',
  },
  () => {
    console.log('Countdown finished!')
  },
)
</script>
```
