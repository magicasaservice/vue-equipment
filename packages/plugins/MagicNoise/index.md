# MagicNoise

MagicNoise is a rendition of pixelated static noise, as seen on TV in the 90s.

::component-preview{src="./demo/DefaultDemo.vue"}
::

## Anatomy

```vue
<template>
  <magic-noise />
</template>
```

## Installation

### CLI

Add `@maas/vue-equipment` to your dependencies.

::package-install{name="@maas/vue-equipment"}
::

### Vue

If you are using Vue, import and add `MagicNoisePlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicNoisePlugin } from '@maas/vue-equipment/plugins/MagicNoise'

const app = createApp({})

app.use(MagicNoisePlugin)
```

### Nuxt

The component is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicNoise` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicNoise'],
  },
})
```

### Direct Import

If you prefer a more granular approach, the component can also be directly imported into any Vue component.

```vue
<script setup>
import { MagicNoise } from '@maas/vue-equipment/plugins/MagicNoise'
</script>

<template>
  <magic-noise />
</template>
```

## Peer Dependencies

MagicNoise has no optional peer dependencies. It only relies on the [core peer dependencies](/overview/getting-started#core), which npm, pnpm and bun install automatically.

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
      - label: options
        description: Refer to the [options table](#options) for details.
      - label: MagicNoiseOptions
      - label: 'false'
  - items:
      - label: pause
        description: Pause the noise animation.
      - label: boolean
      - label: 'false'
---
::

### Options

To customize the component, override the necessary options. Any custom options will be merged with the default options.

::docs-table
---
columns:
  - label: Option
  - label: Type
  - label: Default
rows:
  - items:
      - label: pixelSize
        description: Update the pixel size.
      - label: number
      - label: '2'
  - items:
      - label: tiles
        description: For performance reasons, the component tiles the animation. To avoid artifacts, keep in mind the pixel size as well as the components dimensions when setting this option.
      - label: number
      - label: '32'
  - items:
      - label: fps
        description: Update the number of frames per second.
      - label: number
      - label: '12'
  - items:
      - label: color
        description: The foreground color of the noise. The background color can be changes with a [CSS variable](#css-variables).
      - label: string
      - label: white
  - items:
      - label: alpha
        description: A boolean value indicating if the canvas should be drawn with a transparent backdrop. Setting this to true might slow rendering performance.
      - label: boolean
      - label: 'false'
  - items:
      - label: alpha
        description: Sets the [color space](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext#colorspace) of the noise.
      - label: string
        description: "'srgb' | 'muldisplay-p3tiple'"
      - label: srgb
---
::

### CSS Variables

The component comes with some CSS variables for customization.

::docs-table
---
columns:
  - label: Variable
  - label: Default
rows:
  - items:
      - label: --magic-noise-background
        description: Make sure to set `options.alpha` to `true`. Otherwise the background will not be visible.
      - label: '#000'
  - items:
      - label: --magic-noise-loading-background
      - label: '#000'
  - items:
      - label: --magic-noise-loading-transition
      - label: color 300ms ease, opacity 300ms ease
---
::

## Examples

### Custom Color

::component-preview{src="./demo/CustomColorDemo.vue"}
::
