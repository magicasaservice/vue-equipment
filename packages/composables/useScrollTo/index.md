# useScrollTo

Scroll to element

## Usage

```ts
import { useScrollTo } from '@magicasaservice/vue-equipment/composables'

const { scrollToTarget } = useScrollTo()
const el = ref()

scrollToTarget({
  target: el,
  speed: 1000,
  offset: 0,
})
```
