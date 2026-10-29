# useScrollLockPadding

A small utility to prevent fixed elements from jumping when locking scroll. Intended to be used in combination with [`useScrollLock`](https://vueuse.org/core/useScrollLock/).

::component-preview{src="./demo/DefaultDemo.vue"}
::

## Anatomy

```js
import { useScrollLockPadding } from '@maas/vue-equipment/composables/useScrollLockPadding'

const { add, remove } = useScrollLockPadding()

add()
remove()
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
} from '@maas/vue-equipment/composables/useScrollLockPadding'
```
