# MagicToast

MagicToast let’s you trigger and display toasts from anywhere.

<component-preview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicToastPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicToastPlugin } from '@maas/vue-equipment/plugins'

const app = createApp({})

app.use(MagicToastPlugin)
```

### Nuxt

The toaster is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicToast` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicToast'],
  },
})
```

## Examples

### Position

<component-preview src="./demo/PositionDemo.vue" />
