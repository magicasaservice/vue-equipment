# MagicScroll

MagicScroll is a flexible collection of components intended to build various types of scroll-based animations and alerts.

<component-preview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicScrollPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicScrollPlugin } from '@maas/vue-equipment/plugins'

const app = createApp({})

app.use(MagicScrollPlugin)
```

### Nuxt

The components are available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicScroll` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicScroll'],
  },
})
```

## Examples

### Collision Detection

<component-preview src="./demo/CollisionDetectionDemo.vue" />
