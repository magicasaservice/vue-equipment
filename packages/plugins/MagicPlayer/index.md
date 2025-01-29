# Magic Player

Magic Player is a collection of components made to build a flexible, streaming ready media player for video as well as audio playback.

<ComponentPreview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-player-provider id="your-player-id" src="your-video.m3u8">
    <magic-player-video />
    <magic-player-poster>
      <!-- your content -->
    </magic-player-poster>
    <magic-player-overlay />
    <magic-player-video-controls>
      <template #seek-popover>
        <magic-player-mux-popover playbackId="your-playback-id" />
      </template>
    </magic-player-video-controls>
  </magic-player-provider>
</template>

<script>
const { playerApi } = useMagicPlayer('your-player-id')
</script>

<style>
@import '@maas/vue-equipment/MagicPlayer/css/magic-player-video-controls.css';
</style>
```

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

### Vue

If you are using Vue, import and add `MagicPlayerPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicPlayerPlugin } from '@maas/vue-equipment/plugins'

const app = createApp({})

app.use(MagicPlayerPlugin)
```

### Nuxt

The player is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicPlayer` to the plugins array in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicPlayer'],
  },
})
```

### Composable

In order to interact with the player from anywhere within your app, we provide a `useMagicPlayer` composable. Import it directly when needed.

```js
import { useMagicPlayer } from '@maas/vue-equipment/plugins'

const { playerApi } = useMagicPlayer('your-player-id')

function handleClick() {
  playerApi.play()
}
```

## Peer Dependencies

If you haven’t installed the required peer dependencies automatically, you’ll need to install the following packages manually to use the modal.

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
    {
      items: [
        {
          label: '[hls.js](https://www.npmjs.com/package/hls.js)'
        }
      ]
    }
  ]"
/>

### Installation

::: code-group

```sh [pnpm]
pnpm install @nuxt/kit @vueuse/core defu hls.js
```

```sh [npm]
npm install @nuxt/kit @vueuse/core defu hls.js
```

```sh [yarn]
yarn add @nuxt/kit @vueuse/core defu hls.js
```

```sh [bun]
bun install @nuxt/kit @vueuse/core defu hls.js
```

:::

## API Reference

### Props

#### MagicPlayerProvider

The provider wraps the menu and configures all child components according to the provided [options](#options).

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
          label: 'MagicPlayerOptions'
        },
        {
          label: 'false'
        }
      ]
    },
  ]"
/>

#### MagicPlayerVideoControls

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
          description: 'Providing an id is optional. Neccessary if the controls are not nested inside `MagicPlayerProvider`.'
        },
        {
          label: 'MaybeRef\<string\>',
          escape: true
        },
        {
          label: 'false'
        }
      ]
    },
    {
      items: [
        {
          label: 'standalone',
          description: 'Set to true, if the component is not nested inside `MagicPlayerProvider`.'
        },
        {
          label: 'boolean'
        },
        {
          label: 'false'
        }
      ]
    },
    {
      items: [
        {
          label: 'transition',
          description: 'Override the [transition name](https://vuejs.org/guide/built-ins/transition#named-transitions).'
        },
        {
          label: 'boolean'
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

#### MagicPlayerMuxPopover

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
          label: 'playbackId',
          'description': 'Neccessary if the ancestral `MagicPlayerVideoControls` component is set to `standalone`. '
        },
        { 
          label: 'string'
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

#### MagicPlayerAudioControls

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
          description: 'Providing an id is optional. Neccessary if the controls are not nested inside `MagicPlayerProvider`.'
        },
        {
          label: 'MaybeRef\<string\>',
          escape: true
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

#### MagicPlayerDisplayTime

This component is used internally by both the video and audio controls components. You are most likely not going to need it unless you want to implement your own custom controls.

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
          label: 'type',
        },
        { 
          label: 'string',
          description: '\'current\' | \'remaining\' | \'duration\''
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

### CSS Variables

#### MagicPlayerProvider

<ProseTable 
  :columns="[
    { label: 'Variable' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        { label: '--magic-player-provider-height' },
        { label: 'auto' }
      ]
    },
    {
      items: [
        { label: '--magic-player-provider-aspect-ratio' },
        { label: '16 / 9' }
      ]
    },
    {
      items: [
        { label: '--magic-player-provider-background' },
        { label: '#000' }
      ]
    }
  ]"
/>

#### MagicPlayerOverlay

<ProseTable 
  :columns="[
    { label: 'Variable' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        { label: '--magic-player-overlay-background' },
        { label: 'rgba(0, 0, 0, 0.3)' }
      ]
    },
    {
      items: [
        { label: '--magic-player-overlay-color' },
        { label: 'rgba(255, 255, 255, 1)' }
      ]
    },
    {
      items: [
        { label: '--magic-player-overlay-transition' },
        { label: 'opacity 300ms ease' }
      ]
    },
    {
      items: [
        { label: '--magic-player-overlay-button-size' },
        { label: '2.5rem' }
      ]
    }
  ]"
/>

#### MagicPlayerMuxPopover

<ProseTable 
  :columns="[
    { label: 'Variable' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        { label: '--magic-player-popover-border-radius' },
        { label: '0.25rem' }
      ]
    }
  ]"
/>

## Examples

### Audio Player

<component-preview src="./demo/AudioPlayerDemo.vue" />

### Autoplay

<component-preview src="./demo/AutoplayDemo.vue" />

### Poster Image

<component-preview src="./demo/ImagePosterDemo.vue" />

### Standalone Controls

<component-preview src="./demo/StandaloneControlsDemo.vue" />
