# Magic Player

Magic Player is a collection of components made to build a flexible, streaming ready media player for video as well as audio playback.

<ComponentPreview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-player id="your-player-id" src="your-video.m3u8">
    <magic-player-poster>
      <img src="your-image.jpg" alt="your poster image alt text" />
    </magic-player-poster>
    <magic-player-overlay />
    <magic-player-controls>
      <template #seek-popover>
        <magic-player-mux-popover playbackId="your-playback-id" />
      </template>
    </magic-player-controls>
  </magic-player>
</template>

<script>
const { playerApi } = useMagicPlayer('your-player-id')
</script>
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

#### MagicPlayer

## Examples

### Audio Player

<component-preview src="./demo/AudioPlayerDemo.vue" />

### Autoplay

<component-preview src="./demo/AutoplayDemo.vue" />

### Poster Image

<component-preview src="./demo/ImagePosterDemo.vue" />

### Standalone Controls

<component-preview src="./demo/StandaloneControlsDemo.vue" />
