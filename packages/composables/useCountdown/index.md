# useCountdown

Counts down to a specific time and date, based on `luxon` and `@maas/magic-timer`

## Usage

```ts
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
```
