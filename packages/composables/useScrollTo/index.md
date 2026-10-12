# useScrollTo

Scroll to an element with consistent speed.

::component-preview{src="./demo/DefaultDemo.vue"}
::

## Anatomy

```js
import { useScrollTo } from '@maas/vue-equipment/composables/useScrollTo'

const { scrollToTarget } = useScrollTo()

scrollToTarget({
  target,
  speed: 1000,
})
```

## Installation

### CLI

Add `@maas/vue-equipment` to your dependencies.

::package-install{name="@maas/vue-equipment"}
::
