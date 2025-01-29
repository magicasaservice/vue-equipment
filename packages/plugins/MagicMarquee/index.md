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

### Composable

In order to interact with the marquee from anywhere within your app, we provide a `useMagicMarquee` composable. Import it directly when needed.

```js
import { useMagicMarquee } from '@maas/vue-equipment/plugins'

const { play } = useMagicMarquee('your-marquee-id')

function handleClick() {
  play()
}
```

> [!TIP]
> If you have installed the marquee as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

## Peer Dependencies

If you haven’t installed the required peer dependencies automatically, you’ll need to install the following packages manually to use the command palette.

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
    },
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

### Options

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
          label: 'direction',
          description: 'Set the animation direction.'
        },
        { 
          label: 'string',
          description: '\'reverse\' | \'normal\'' 
        },
        { 
          label: 'normal'
        }
      ]
    },
    {
      items: [
        { 
          label: 'speed',
          description: 'Set the animation speed.'
        },
        { 
          label: 'number' 
          },
        { 
          label: '1' 
          }
      ]
    }
  ]"
/>

### CSS Variables

<ProseTable 
  :columns="[
    { label: 'Variable' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        { label: '--magic-marquee-justify-content' },
        { label: 'flex-start' }
      ]
    },
    {
      items: [
        { label: '--magic-marquee-align-items' },
        { label: 'baseline' }
      ]
    },
    {
      items: [
        { label: '--magic-marquee-gap' },
        { label: '1rem' }
      ]
    },
    {
      items: [
        { label: '--magic-marquee-content-width' },
        { label: 'unset' }
      ]
    },
    {
      items: [
        { 
          label: '--magic-marquee-animation-name',
          description: 'This variable is crucial for the component’s core functionality. Overriding it manually might lead to unwanted side effects.'
        },
        { label: 'magicMarqueeScrollX' }
      ]
    },
    {
      items: [
        { 
          label: '--magic-marquee-animation-duration', 
          description: 'This variable is crucial for the component’s core functionality. Overriding it manually might lead to unwanted side effects.'
        },
        { label: '-' }
      ]
    },
    {
      items: [
        { 
          label: '--magic-marquee-animation-play-state', 
          description: 'This variable is crucial for the component’s core functionality. Overriding it manually might lead to unwanted side effects.'
        },
        { label: 'running' }
      ]
    },
    {
      items: [
        { 
          label: '--magic-marquee-animation-direction', 
          description: 'This variable is crucial for the component’s core functionality. Overriding it manually might lead to unwanted side effects.'
        },
        { label: 'normal' }
      ]
    }
  ]"
/>

## Examples

### Play Pause

<component-preview src="./demo/PlayPauseDemo.vue" />

### Playback Speed

<component-preview src="./demo/PlaybackSpeedDemo.vue" />
