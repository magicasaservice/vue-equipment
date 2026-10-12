# useCountdown

Calculate the remaining time until a given moment.

::component-preview{src="./demo/DefaultDemo.vue"}
::

## Anatomy

```js
import {
  useCountdown,
  type DateTimeArray,
} from '@maas/vue-equipment/composables/useCountdown'

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

## Installation

### CLI

Add `@maas/vue-equipment` to your dependencies.

::package-install{name="@maas/vue-equipment"}
::

### Direct import

Import the composable directly where you need it.

```js
import {
  useCountdown,
  type DateTimeArray,
} from '@maas/vue-equipment/composables/useCountdown'
```
