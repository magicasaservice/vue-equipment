# MagicMarquee

MagicMarquee is a flexible, unstyled, CSS driven marquee component.

::component-preview{src="./demo/DefaultDemo.vue"}
::

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

## Installation

### CLI

Add `@maas/vue-equipment` to your dependencies.

::package-install{name="@maas/vue-equipment"}
::

### Vue

If you are using Vue, import and add `MagicMarqueePlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicMarqueePlugin } from '@maas/vue-equipment/plugins/MagicMarquee'

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

### Composable

In order to interact with the marquee from anywhere within your app, we provide a `useMagicMarquee` composable. Import it directly when needed.

```js
import { useMagicMarquee } from '@maas/vue-equipment/plugins/MagicMarquee'

const { play } = useMagicMarquee('your-marquee-id')

function handleClick() {
  play()
}
```

::tip
If you have installed the marquee as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.
::

## Peer Dependencies

MagicMarquee has no optional peer dependencies. It only relies on the [core peer dependencies](/overview/getting-started#core), which npm, pnpm and bun install automatically.

## API Reference

### Props

::docs-table
---
columns:
  - label: Prop
  - label: Type
  - label: Required
rows:
  - items:
      - label: id
        description: Providing an id is required. Can either be a string or a ref.
      - label: MaybeRef<string>
        escape: true
      - label: 'true'
  - items:
      - label: options
        description: Refer to the [options table](#options) for details.
      - label: MagicMarqueeOptions
      - label: 'false'
---
::

### Options

::docs-table
---
columns:
  - label: Option
  - label: Type
  - label: Default
rows:
  - items:
      - label: direction
        description: Set the animation direction.
      - label: string
        description: "'reverse' | 'normal'"
      - label: normal
  - items:
      - label: speed
        description: Set the animation speed.
      - label: number
      - label: '1'
---
::

### CSS Variables

::docs-table
---
columns:
  - label: Variable
  - label: Default
rows:
  - items:
      - label: --magic-marquee-justify-content
      - label: flex-start
  - items:
      - label: --magic-marquee-align-items
      - label: baseline
  - items:
      - label: --magic-marquee-gap
      - label: 1rem
  - items:
      - label: --magic-marquee-content-width
      - label: unset
---
::

## Examples

### Play Pause

::component-preview{src="./demo/PlayPauseDemo.vue"}
::

### Playback Speed

::component-preview{src="./demo/PlaybackSpeedDemo.vue"}
::
