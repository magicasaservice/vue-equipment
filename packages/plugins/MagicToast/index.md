# MagicToast

MagicToast let’s you trigger and display toasts from anywhere.

<component-preview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-toast-provider id="your-toast-id" />
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { useMagicToast } from '@maas/vue-equipment/plugins'

const component = defineAsyncComponent(() => import('./YourToast.vue'))
const { add } = useMagicToast('your-toast-id')

function handleClick() {
  add({ component })
}
</script>
```

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

### Composable

In order to interact with the toaster from anywhere within your app, we provide a `useMagicToaster` composable. Import it directly when needed.

```js
const component = defineAsyncComponent(() => import('./YourToast.vue'))
const { add } = useMagicToast('your-toast-id')

function handleClick() {
  add({ component })
}
```

> [!TIP]
> If you have installed the toaster as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

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
          label: '[@vueuse/core](https://www.npmjs.com/package/@vueuse/core)'
        }
      ]
    },
    {
      items: [
        {
          label: '[defu](https://www.npmjs.com/package/defu)'
        }
      ]
    }
  ]"
/>

### Installation

::: code-group

```sh [pnpm]
pnpm install @nuxt/kit @vueuse/core defu
```

```sh [npm]
npm install @nuxt/kit @vueuse/core defu
```

```sh [yarn]
yarn add @nuxt/kit @vueuse/core defu
```

```sh [bun]
bun install @nuxt/kit @vueuse/core defu
```

:::

## API Reference

### MagicToastProvider

The MagicToastProvider wraps the toaster and configures it according to the provided [options](#options).

#### Props

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
          label: 'id',
          description: 'Providing an id is required. Can either be a string or a ref.'
        },
        {
          label: 'MaybeRef\<string\>',
          escape: true
        },
        {
          label: 'true'
        }
      ]
    },
    {
      items: [
        {
          label: 'options',
          description: 'Refer to the [options table](#options) for details.'
        },
        {
          label: 'MagicMenuOptions'
        },
        {
          label: 'false'
        }
      ]
    },
  ]"
/>

#### Options

<ProseTable 
  :columns="[
    { label: 'Option' },
    { label: 'Type' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        { 
          label: 'debug',
          description: 'Set to true to get visual feedback on positioning.'
        },
        { label: 'boolean' },
        { label: 'false' }
      ]
    },
    {
      items: [
        { 
          label: 'position',
          description: 'Set the toaster’s position relative to the viewport.'
        },
        { label: 'Position' },
        { label: 'bottom-center' }
      ]
    },
    {
      items: [
        { 
          label: 'duration',
          description: 'Duration in milliseconds before the toast auto-dismisses. Set to 0 to disable.'
        },
        { label: 'number' },
        { label: '0' }
      ]
    },
    {
      items: [
        {
          label: 'scrollLock',
          description: 'Lock body scroll when dragging a toast.'
        },
        { label: 'boolean | object' },
        { label: 'object' }
      ]
    },
    {
      items: [
        {
          label: 'scrollLock.padding',
          description: 'Locking the body scroll hides any permanently visible scrollbar. Adding a padding to fixed elements prevents them from shifting in this case.'
        },
        { label: 'boolean' },
        { label: 'true' }
      ]
    },
    {
      items: [
        {
          label: 'teleport.target',
          description: 'Specify the teleport target.'
        },
        { label: 'string' },
        { label: 'body' }
      ]
    },
    {
      items: [
        {
          label: 'teleport.disabled',
          description: 'Disable teleporting the toast completely.'
        },
        { label: 'boolean' },
        { label: 'false' }
      ]
    },
    {
      items: [
        {
          label: 'transition',
          description: 'Set the transition name for the toast.'
        },
        { label: 'string' },
        { label: 'magic-toast' }
      ]
    },
    {
      items: [
        {
          label: 'layout.expand',
          description: 'Configure wether the toasts should expand on click, hover or not at all.'
        },
        { 
          label: 'string | false',
          description: 'false | \'hover\' | \'click\''
        },
        { label: 'click' }
      ]
    },
    {
      items: [
        {
          label: 'layout.max',
          description: 'Maximum number of toasts to show at once.'
        },
        { label: 'number' },
        { label: '3' }
      ]
    },
    {
      items: [
        {
          label: 'animation.snap.duration',
          description: 'Configure the toast’s snap animation duration.'
        },
        { label: 'number' },
        { label: '300' }
      ]
    },
    {
      items: [
        {
          label: 'animation.snap.easing',
          description: 'Configure the toast’s snap animation easing function.'
        },
        { 
          label: 'function',
          description: '(t: number) => number'
        },
        { label: '—' }
      ]
    },
    {
      items: [
        {
          label: 'initial.expanded',
          description: 'Whether toasts should be expanded initially.'
        },
        { label: 'boolean' },
        { label: 'false' }
      ]
    },
    {
      items: [
        {
          label: 'threshold.lock',
          description: 'Configure the dragged distance before the toaster prevents other touch interactions.'
        },
        { label: 'number' },
        { label: '8' }
      ]
    },
    {
      items: [
        {
          label: 'threshold.distance',
          ddescription: 'Configure the dragged distance before the toast snaps.'
        },
        { label: 'number' },
        { label: '32' }
      ]
    },
    {
      items: [
        {
          label: 'threshold.momentum',
          description: 'Configure the momentum from when the toast snaps.'
        },
        { label: 'number' },
        { label: '1' }
      ]
    }
  ]"
/>

#### CSS Variables

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        { label: '--magic-toast-padding-y' },
        { label: '1rem' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-padding-x' },
        { label: '1rem' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-gap' },
        { label: '0.75rem' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-duration' },
        { label: '175ms' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-scale-factor' },
        { label: '0.05' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-overlap-y' },
        { label: '1rem' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-position' },
        { label: 'fixed' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-inset' },
        { label: '0' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-width' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-height' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-z-index' },
        { label: '999' }
      ]
    }
  ]"
/>

### MagicToastView

MagicToastView is used internally. Some CSS is configurable.

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        { label: '--magic-toast-view-transition' },
        { label: 'all var(--magic-toast-duration) var(--ease-in-out)' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-view-cursor' },
        { label: 'grab' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-view-cursor-dragging' },
        { label: 'grabbing' }
      ]
    }
  ]"
/>

## Examples

### Position

<component-preview src="./demo/PositionDemo.vue" />

### Expanded

<component-preview src="./demo/ExpandedDemo.vue" />

### Collapsed

<component-preview src="./demo/CollapsedDemo.vue" />

### Hover

<component-preview src="./demo/HoverDemo.vue" />
