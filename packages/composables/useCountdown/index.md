# useCountdown

A composable function that returns the remaining time until a given Date and Time.

## Usage

```ts
import { useCountdown } from '@maas/vue-equipment/composables'
const { years, days, hours, minutes, seconds } = useCountdown(
  {
    endDateTime: [2024, 1, 1],
    timezone: 'Europe/Berlin',
  },
  () => {
    console.log('Countdown finished!')
  },
)
```
