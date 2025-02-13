# useCountdown

Calculate the remaining time until a given moment.

<component-preview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```js
import {
  useCountdown,
  type DateTimeArray,
} from '@maas/vue-equipment/composables'

const nextYear = computed(() => new Date().getFullYear() + 1)
const refDate = ref(`${nextYear.value}-01-01 00:00:00`)

const refDateArray = computed(() => {
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

function callback() {
  console.log('Countdown finished!')
}

const args = {
  endDateTime: dateArray,
  timezone: 'Europe/Berlin',
}

const { years, days, hours, minutes, seconds } = useCountdown(args, callback)
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Direct import

Import the composable directly where you need it.

```js
import {
  useCountdown,
  type DateTimeArray,
} from '@maas/vue-equipment/composables'
```
