# MagicPlayer

MagicPlayer is a collection of components made to build a flexible, streaming ready media player for video as well as audio playback.

<ComponentPreview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-player-provider id="your-player-id" src="your-src.m3u8">
    <magic-player-video />
    <magic-player-poster>
      <!-- your content -->
    </magic-player-poster>
    <magic-player-overlay />
    <magic-player-video-controls>
      <template #seek-popover>
        <magic-player-mux-popover />
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

The player is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicPlayer` to the plugins in your configuration.

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

> [!TIP]
> If you have installed the component as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

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

### MagicPlayerProvider

The MagicPlayerProvider wraps the menu and configures all child components according to the provided [options](#options).

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
          label: 'MagicPlayerOptions'
        },
        {
          label: 'false'
        }
      ]
    },
  ]"
/>

#### Options

To customize the player override the necessary options. Any custom options will be merged with the default options.

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
          label: 'src',
          description: 'Can be a video file, a streaming link (.m3u8 or an audio file.'
        },
        { 
          label: 'string'
        },
        { 
          label: '–' 
        }
      ]
    },
    {
      items: [
        { 
          label: 'mode',
        },
        { 
          label: 'PlayerMode',
          description:  '\'audio\' | \'video\''
        },
        { 
          label: 'video'
        }
      ]
    },
    {
      items: [
        { 
          label: 'srcType',
          description: 'Set this to `hls` to enable straming links.'
        },
        { 
          label: 'string',
          description: '\'native\' | \'hls\'' 
        },
        { 
          label: 'native' 
        }
      ]
    },
    {
      items: [
        { 
          label: 'preload',
        },
        { 
          label: 'string',
          description: '\'auto\' | \'metadata\' | \'none\''
        },
        { 
          label: 'metadata' 
        }
      ]
    },
    {
      items: [
        { 
          label: 'autoplay',
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
          label: 'playback',
          description: 'Override how playback is managed in relation to the visibility inside the viewport and the window’s focus.'
        },
        { 
          label: 'string[]',
          description: '(\'viewport\' | \'window\')[]'
        },
        { 
          label: '[\'viewport\'] | [\'viewport\', \'window\']',
          description: 'Dependant on `options.mode`'
        }
      ]
    },
    {
      items: [
        { 
          label: 'loop',
          description: 'Ignored for players with type `audio`.'
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
          label: 'transition.videoControls',
          description: 'Override the transition name of the video controls.'
        },
        { 
          label: 'string' 
        },
        { 
          label: 'magic-player-video-controls' 
        }
      ]
    },
    {
      items: [
        {
          label: 'transition.overlay',
          description: 'Override the name of the overlay’s outer wrapper transition.'
        },
        { 
          label: 'string' 
        },
        { 
          label: 'magic-player-overlay' 
        }
      ]
    },
    {
      items: [
        {
          label: 'transition.icons',
          description: 'Override the name of the overlay’s transition between icons.'
        },
        { 
          label: 'string' 
        },
        { 
          label: 'magic-player-icons' 
        }
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

### MagicPlayerOverlay

#### CSS Variables

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
        { label: '--magic-player-overlay-button-size' },
        { label: '2rem' }
      ]
    }
  ]"
/>

### MagicPlayerVideoControls

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
          label: 'transition.overlay',
          description: 'Override the [name](https://vuejs.org/guide/built-ins/transition#named-transitions) of the outer wrapper’s transition.'
        },
        {
          label: 'string'
        },
        {
          label: 'false'
        }
      ]
    },
    {
      items: [
        {
          label: 'transition.icons',
          description: 'Override the [transition name](https://vuejs.org/guide/built-ins/transition#named-transitions) of the transition between icons.'
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

#### CSS

Due to their complexity and opinionated nature, we have externalized the styles for this component. Make sure to import them if needed. If not style the component manually.

```css
@import '@maas/vue-equipment/MagicPlayer/css/magic-player-video-controls.css';
```

### MagicPlayerMuxPopover

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

#### CSS Variables

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

### MagicPlayerAudioControls

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

#### CSS

Due to their complexity and opinionated nature, we have externalized the styles for this component. Make sure to import them if needed. If not style the component manually.

```css
@import '@maas/vue-equipment/MagicPlayer/css/magic-player-audio-controls.css';
```

### MagicPlayerDisplayTime

This component is used internally by both the video and audio controls components. You are most likely not going to need it directly, unless you want to implement your own custom controls.

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

## Examples

### Audio Player

<component-preview src="./demo/AudioPlayerDemo.vue" />

### Autoplay

<component-preview src="./demo/AutoplayDemo.vue" />

### Autoplay with Controls

<component-preview src="./demo/AutoplayControlsDemo.vue" />

### Controls without Overlay

<component-preview src="./demo/OmitOverlayDemo.vue" />

### Standalone Controls

<component-preview src="./demo/StandaloneControlsDemo.vue" />

### Native Controls

<component-preview src="./demo/NativeControlsDemo.vue" />

### Poster Image

<component-preview src="./demo/ImagePosterDemo.vue" />

### Composable

<component-preview src="./demo/ComposableDemo.vue" />
