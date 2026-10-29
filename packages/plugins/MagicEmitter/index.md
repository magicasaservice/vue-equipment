# MagicEmitter

MagicEmitter is a wrapper around [mitt](https://github.com/developit/mitt). The emitter is used throughout all plugins to emit custom events. By using the emitter to listen to these events, you can trigger custom callbacks, after a modal opens or a drawer closes for example.

## Anatomy

```vue
<script setup>
import { onBeforeUnmount } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'

function callback(id, payload) {
  // your callback
}

const emitter = useMagicEmitter()

emitter.on('*', callback)

onBeforeUnmount(() => {
  emitter.off('*', callback)
})
</script>
```

## Installation

### CLI

Add `@maas/vue-equipment` to your dependencies.

::package-install{name="@maas/vue-equipment"}
::

### Nuxt

The emitter is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicEmitter` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicEmitter'],
  },
})
```

### Composable

In order to interact with the emitter from anywhere within your app, immport the `useMagicEmitter` composable.

```js
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'

const emitter = useMagicEmitter()

emitter.on('*', callback)
emitter.off('*', callback)
```

::tip
If you have installed the emitter as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.
::

## Peer Dependencies

MagicEmitter has no optional peer dependencies. It only relies on the [core peer dependencies](/overview/getting-started#core), which npm, pnpm and bun install automatically.

## Typescript

The emitter is fully typesafe. We provide types to import as well as some useful utilities to type your callback functions.

### All Events

```ts
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins/MagicEmitter'
import type { ValueOf } from '@maas/vue-equipment/utils'

function callback(
  id: keyof MagicEmitterEvents,
  payload: ValueOf<MagicEmitterEvents>
) {
  // your callbck
}

const emitter = useMagicEmitter()

emitter.on('*', callback)

onBeforeUnmount(() => {
  emitter.off('*', callback)
})
```

### Selected Events

```ts
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins/MagicEmitter'

function callback(payload: MagicEmitterEvents['beforeEnter']) {
  // your callbck
}

const emitter = useMagicEmitter()

emitter.on('beforeEnter', callback)

onBeforeUnmount(() => {
  emitter.off('beforeEnter', callback)
})
```
