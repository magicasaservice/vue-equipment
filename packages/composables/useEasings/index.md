# useEasings

A standard set of easing functions neatly packaged into a composable.

::component-preview{src="./demo/DefaultDemo.vue"}
::

## Anatomy

```js
import { useEasings } from '@maas/vue-equipment/composables/useEasings'

const { easeOutQuad } = useEasings()
easeOutQuad(300)
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
} from '@maas/vue-equipment/composables/useEasings'
```
