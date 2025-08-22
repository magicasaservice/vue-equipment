# useScrollTo

Scroll to an element with consistent speed.

<component-preview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```js
import { useScrollTo } from '@maas/vue-equipment/composables/useScrollTo'

const { scrollToTarget } = useScrollTo()

scrollToTarget({
  target,
  speed: 1000,
})
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->
