# Magic Emitter

A simple wrapper around [mitt](https://github.com/developit/mitt), to listen to all Vue Equipment events.

## Usage

```js
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'

function callback(payload: keyof MagicEmitterEvents) {
  const [event, id] = payload
  console.log(event, id)
}

useMagicEmitter().on('*', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('*', callback)
})
```
