# MagicPie

MagicPie renders a percentage based value as `SVG`.

::component-preview{src="./demo/DefaultDemo.vue"}
::

## Anatomy

```vue
<template>
  <magic-pie id="your-pie-id" />
</template>

<script setup>
const { percentage } = useMagicPie('your-pie-id')
</script>
```

## Installation

### CLI

Add `@maas/vue-equipment` to your dependencies.

::package-install{name="@maas/vue-equipment"}
::

### Vue

If you are using Vue, import and add `MagicPiePlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicPiePlugin } from '@maas/vue-equipment/plugins/MagicPie'

const app = createApp({})

app.use(MagicPiePlugin)
```

### Nuxt

The pie is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicPie` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicPie'],
  },
})
```

### Direct Import

If you prefer a more granular approach, the pie can also be directly imported into any Vue component.

```vue
<script setup>
import { MagicPie } from '@maas/vue-equipment/plugins/MagicPie'
</script>

<template>
  <magic-pie id="your-pie-id" />
</template>
```

### Composable

In order to interact with the pie from anywhere within your app, we provide a `useMagicPie` composable. Import it directly when needed.

```js
import { onMounted } from 'vue'
import { useMagicPie } from '@maas/vue-equipment/plugins/MagicPie'

const { setPercentage } = useMagicPie('your-pie-id')

onMounted(() => {
  setPercentage(50)
})
```

::tip
If you have installed the pie as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.
::

## API Reference

### Props

The pie comes with a simple set of props. Only the id is required.

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
      - label: MagicPieOptions
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
      - label: flip
        description: Invert the SVG’s path direction.
      - label: boolean
      - label: 'false'
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
      - label: --magic-pie-background
      - label: transparent
  - items:
      - label: --magic-pie-foreground
      - label: currentColor
---
::

## Examples

### Flip

::component-preview{src="./demo/FlipDemo.vue"}
::

## Errors

::docs-table
---
columns:
  - label: Source
  - label: Error Code
  - label: Message
rows:
  - items:
      - label: MagicPie
      - label: missing_points
      - plaintext: true
        label: At least two points are required to generate a path
  - items:
      - label: MagicPie
      - label: invalid_percentage
      - plaintext: true
        label: percentage needs to be between 0 and 100
---
::
