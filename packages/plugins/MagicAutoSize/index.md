# Magic Auto Size

Magic Auto Size is a container that automatically grows and shrinks to its child’s size.

<component-preview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-auto-size>
    <!-- your content -->
  </magic-auto-size>
</template>
```

> [!IMPORTANT]
> The component's children need to be either given a fixed width or rendered as `inline`, `inline-block`, or `inline-flex` elements.

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicAutoSizePlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicAutoSizePlugin } from '@maas/vue-equipment/plugins'

const app = createApp({})

app.use(MagicAutoSizePlugin)
```

### Nuxt

The component is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicAutoSize` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicAutoSize'],
  },
})
```

### Direct Import

If you prefer a more granular approach, the component can also be directly imported into any Vue component.

```vue
<script setup>
import { MagicAutoSize } from '@maas/vue-equipment/plugins'
</script>

<template>
  <magic-auto-size>
    <!-- your content -->
  </magic-auto-size>
</template>
```

## Peer Dependencies

If you haven’t installed the required peer dependencies automatically, you’ll need to install the following packages manually to use the component.

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
          label: '[@maas/vue-primitive](https://www.npmjs.com/package/@maas/vue-primitive)'
        }
      ]
    },
    {
      items: [
        {
          label: '[@vueuse/core](https://www.npmjs.com/package/@vueuse/core)'
        }
      ]
    },
  ]"
/>

### Installation

::: code-group

```sh [pnpm]
pnpm install @nuxt/kit @maas/vue-primitive @vueuse/core
```

```sh [npm]
npm install @nuxt/kit @maas/vue-primitive @vueuse/core
```

```sh [yarn]
yarn add @nuxt/kit @maas/vue-primitive @vueuse/core
```

```sh [bun]
bun install @nuxt/kit @maas/vue-primitive @vueuse/core
```

:::

## API Reference

### Props

<ProseTable
  :columns="[
    { label: 'Prop' },
    { label: 'Type' },
    { label: 'Required' }
  ]"
  :rows="[
    {
      items: [
        {
          label: 'width',
          description: 'Animate the width of the component.'
        },
        {
          label: 'boolean',
        },
        {
          label: 'true'
        }
      ]
    },
    {
      items: [
        {
          label: 'height',
          description: 'Animate the height of the component.'        
        },
        {
          label: 'boolean'
        },
        {
          label: 'true'
        }
      ]
    }
  ]"
/>

### CSS Variables

In order to provide its basic functionality the component comes with some CSS. To ensure that the component is customizable, relevant values are available as CSS variables.

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' },
  ]"
  :rows="[
    {
      items: [
        {
          label: '--magic-auto-size-transition'
        },
        {
          label: 'all 150ms var(--ease-in-out)',
          description: '`var(--ease-in-out)` transpiles to `cubic-bezier(0.45, 0, 0.55, 1)` and can also be overridden.'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-auto-size-transition-delay'
        },
        {
          label: '0ms'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-auto-size-width',
          description: 'This variable is crucial for the component’s core functionality. Overriding it manually might lead to unwanted side effects.'
        },
        {
          label: '-'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-auto-size-height',
          description: 'This variable is crucial for the component’s core functionality. Overriding it manually might lead to unwanted side effects.'
        },
        {
          label: '-'
        },
      ]
    }
  ]"
/>
