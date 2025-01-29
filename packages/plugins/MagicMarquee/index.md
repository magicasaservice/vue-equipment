# MagicMarquee

MagicMarquee is a flexible, unstyled, CSS driven marquee component.

<ComponentPreview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-marquee>
    <!-- your content -->
  </magic-marquee>
</template>

<script setup>
const { play } = useMagicMarquee('your-marquee-id')
</script>
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicMarqueePlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicMarqueePlugin } from '@maas/vue-equipment/plugins'

const app = createApp({})

app.use(MagicMarqueePlugin)
```

### Nuxt

The marquee is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicMarquee` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicMarquee'],
  },
})
```

## Examples

### Play Pause

<component-preview src="./demo/PlayPauseDemo.vue" />

### Playback Speed

<component-preview src="./demo/PlaybackSpeedDemo.vue" />
