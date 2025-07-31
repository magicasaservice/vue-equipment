# useEasings

A standard set of easing functions neatly packaged into a composable.

<component-preview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```js
import { useEasings } from '@maas/vue-equipment/composables/useEasings'

const { easeOutQuad } = useEasings()
easeOutQuad(300)
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Direct import

Import the composable directly where you need it.

```js
import {
  useCountdown,
  type DateTimeArray,
} from '@maas/vue-equipment/composables/useEasings'
```
