# useScrollTo

Scroll to element with a set speed

## Usage

```ts
import { useScrollTo } from '@magicasaservice/vue-equipment/composables'

const { scrollToTarget } = useScrollTo()
const el = ref()

scrollToTarget({
  target: el,
  speed: 1000,
  offset: { x: 0, y: 50 },
})
```
