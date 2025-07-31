# MagicEmitter

MagicEmitter is a wrapper around [mitt](https://github.com/developit/mitt). The emitter is used throughout all plugins to emit custom events. By using the emitter to listen to these events, you can trigger custom callbacks, after a modal opens or a drawer closes for example.

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<script setup>
import { onBeforeUnmount } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'

function callback(id, payload) {
  // your callback
}

useMagicEmitter().on('*', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('*', callback)
})
</script>
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

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

useMagicEmitter().on('*', callback)
useMagicEmitter().off('*', callback)
```

> [!TIP]
> If you have installed the component as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

## Peer Dependencies

If you haven’t installed the required peer dependencies automatically, you’ll need to install the following packages manually.

<ProseTable
  :columns="[
    { label: 'Package'},
  ]"
  :rows="[
    {
      items: [
        {
          label: '[@nuxt/kit](https://www.npmjs.com/package/@nuxt/kit)'
        }
      ]
    },
    {
      items: [
        {
          label: '[mitt](https://www.npmjs.com/package/mitt)'
        }
      ]
    }
  ]"
/>

### Installation

::: code-group

```sh [pnpm]
pnpm install @nuxt/kit mitt
```

```sh [npm]
npm install @nuxt/kit mitt
```

```sh [yarn]
yarn add @nuxt/kit mitt
```

```sh [bun]
bun install @nuxt/kit mitt
```

:::

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

useMagicEmitter().on('*', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('*', callback)
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

useMagicEmitter().on('beforeEnter', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('beforeEnter', callback)
})
```
