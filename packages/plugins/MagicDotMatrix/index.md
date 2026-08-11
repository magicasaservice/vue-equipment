# MagicDotMatrix

MagicDotMatrix is a dot matrix display for playing frame based animations on a grid of dots, complete with a set of ready made sequence presets.

<ComponentPreview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-dot-matrix id="your-dot-matrix-id" :sequence="sequence" />
</template>

<script setup>
import { createRipple } from '@maas/vue-equipment/plugins/MagicDotMatrix'

const sequence = createRipple({ cols: 7, rows: 7 })
</script>
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicDotMatrixPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicDotMatrixPlugin } from '@maas/vue-equipment/plugins/MagicDotMatrix'

const app = createApp({})

app.use(MagicDotMatrixPlugin)
```

### Nuxt

The component is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicDotMatrix` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicDotMatrix'],
  },
})
```

### Direct Import

If you prefer a more granular approach, the component can also be directly imported into any Vue component.

```vue
<script setup>
import { MagicDotMatrix } from '@maas/vue-equipment/plugins/MagicDotMatrix'
</script>

<template>
  <magic-dot-matrix id="your-dot-matrix-id" :sequence="sequence" />
</template>
```

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

## Usage

The dot matrix plays a `sequence` — an array of frames, where each frame is an array of active dot indices. Dots are indexed row by row, starting top left. Either generate sequences with one of the [presets](#presets), or author them by hand.

```js
const sequence = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
]
```

Playback is controlled through the `useMagicDotMatrix` composable. Import and call it with the matching id.

```vue
<script setup>
import { useMagicDotMatrix } from '@maas/vue-equipment/plugins/MagicDotMatrix'

const { play, pause, restart, isPlaying, currentFrame } =
  useMagicDotMatrix('your-dot-matrix-id')
</script>
```

## Presets

The plugin ships with a set of sequence generators. Each takes the grid dimensions and returns a complete sequence.

<ComponentPreview src="./demo/PresetsDemo.vue" />

<ProseTable
  :columns="[
    { label: 'Preset' },
    { label: 'Description' }
  ]"
  :rows="[
    {
      items: [
        { label: 'createRipple' },
        { plaintext: true, label: 'Concentric rings expanding from the center and contracting back.' }
      ]
    },
    {
      items: [
        { label: 'createPulse' },
        { plaintext: true, label: 'A filled circle growing from the center and shrinking back.' }
      ]
    },
    {
      items: [
        { label: 'createComet' },
        { plaintext: true, label: 'A comet with a short trail orbiting the grid’s perimeter.' }
      ]
    },
    {
      items: [
        { label: 'createOrbit' },
        { plaintext: true, label: 'A single dot traveling along the grid’s perimeter.' }
      ]
    },
    {
      items: [
        { label: 'createScan' },
        { plaintext: true, label: 'A horizontal line sweeping from top to bottom.' }
      ]
    },
    {
      items: [
        { label: 'createEqualizer' },
        { plaintext: true, label: 'Audio equalizer style columns rising and falling.' }
      ]
    },
    {
      items: [
        { label: 'createCheckerboard' },
        { plaintext: true, label: 'Alternating checkerboard fields.' }
      ]
    },
    {
      items: [
        { label: 'createFocus' },
        { plaintext: true, label: 'Rings collapsing into the center and expanding back out.' }
      ]
    },
    {
      items: [
        { label: 'createFill' },
        { plaintext: true, label: 'Dots filling the grid one by one, top to bottom.' }
      ]
    },
    {
      items: [
        { label: 'createSpiral' },
        { plaintext: true, label: 'The grid filling along a clockwise spiral.' }
      ]
    },
    {
      items: [
        { label: 'createBounce' },
        { plaintext: true, label: 'A row sweeping down and back up, alternating direction.' }
      ]
    },
    {
      items: [
        { label: 'createDrift' },
        { plaintext: true, label: 'A soft blob drifting organically around the grid.' }
      ]
    }
  ]"
/>

For custom sequences the underlying helpers are exported as well: `toIndex`, `getRings`, `ringPath`, `withTrail` and `equalizerFrame`.

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
          description: 'A unique id, connecting the component to its composable.'
        },
        {
          label: 'MaybeRef\<string\>'
        },
        {
          label: 'true'
        }
      ]
    },
    {
      items: [
        {
          label: 'sequence',
          description: 'The animation to play. An array of frames, each frame an array of active dot indices.'
        },
        {
          label: 'DotMatrixSequence'
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
          label: 'MagicDotMatrixOptions'
        },
        {
          label: 'false'
        }
      ]
    },
  ]"
/>

### Options

To customize the component, override the necessary options. Any custom options will be merged with the default options.

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
          label: 'cols',
          description: 'The number of columns in the grid.'
        },
        { label: 'number' },
        { label: '7' }
      ]
    },
    {
      items: [
        {
          label: 'rows',
          description: 'The number of rows in the grid.'
        },
        { label: 'number' },
        { label: '7' }
      ]
    },
    {
      items: [
        {
          label: 'interval',
          description: 'The time between frames in milliseconds.'
        },
        { label: 'number' },
        { label: '100' }
      ]
    },
    {
      items: [
        {
          label: 'loop',
          description: 'How often the sequence plays. Set to `true` to loop forever, `false` to play once or a number to play that many times.'
        },
        { label: 'boolean | number' },
        { label: 'true' }
      ]
    },
    {
      items: [
        {
          label: 'autoplay',
          description: 'Whether the sequence starts playing once the component is mounted.'
        },
        { label: 'boolean' },
        { label: 'true' }
      ]
    }
  ]"
/>

### useMagicDotMatrix

The composable returns the component’s state as well as functions to control playback.

<ProseTable
  :columns="[
    { label: 'Property' },
    { label: 'Type' },
    { label: 'Description' }
  ]"
  :rows="[
    {
      items: [
        { label: 'state' },
        { label: 'DotMatrixState' },
        { plaintext: true, label: 'The component’s reactive state.' }
      ]
    },
    {
      items: [
        { label: 'isPlaying' },
        { label: 'ComputedRef\<boolean\>' },
        { plaintext: true, label: 'Whether the sequence is currently playing.' }
      ]
    },
    {
      items: [
        { label: 'currentFrame' },
        { label: 'ComputedRef\<number\>' },
        { plaintext: true, label: 'The index of the currently rendered frame.' }
      ]
    },
    {
      items: [
        { label: 'play' },
        { label: '() => void' },
        { plaintext: true, label: 'Start or resume playback.' }
      ]
    },
    {
      items: [
        { label: 'pause' },
        { label: '() => void' },
        { plaintext: true, label: 'Pause playback.' }
      ]
    },
    {
      items: [
        { label: 'restart' },
        { label: '() => void' },
        { plaintext: true, label: 'Reset the sequence to its first frame and start playing.' }
      ]
    }
  ]"
/>

### CSS Variables

The dots’ geometry and colors are styled entirely through CSS. The component fills its container — the dot size is derived from the available width, the number of columns and the gap.

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        {
          label: '--magic-dot-matrix-gap',
          description: 'The gap between dots. Any CSS length except percentages works — use `cqi` for values that scale with the component. The default scales with the component’s width and keeps a 3:1 dot to gap ratio.'
        },
        { label: 'calc(100cqi / (4 * cols - 1))' }
      ]
    },
    {
      items: [
        {
          label: '--magic-dot-matrix-radius',
          description: 'Each dot’s corner radius as a fraction of the dot size. Set to `0.5` for circles, `0` for squares.'
        },
        { label: '0.33' }
      ]
    },
    {
      items: [
        {
          label: '--magic-dot-matrix-color',
          description: 'The color of active dots.'
        },
        { label: 'currentColor' }
      ]
    },
    {
      items: [
        {
          label: '--magic-dot-matrix-inactive-color',
          description: 'The color of inactive dots.'
        },
        { label: 'color-mix(in srgb, currentColor 15%, transparent)' }
      ]
    },
    {
      items: [
        {
          label: '--magic-dot-matrix-background'
        },
        { label: 'transparent' }
      ]
    },
    {
      items: [
        {
          label: '--magic-dot-matrix-transition',
          description: 'A transition applied to each dot’s fill.'
        },
        { label: 'none' }
      ]
    }
  ]"
/>

## Events

The dot matrix emits the following events through [MagicEmitter](../MagicEmitter/). Listen to them with `useMagicEmitter`.

<ProseTable
  :columns="[
    { label: 'Event' },
    { label: 'Payload' },
    { label: 'Description' }
  ]"
  :rows="[
    {
      items: [
        { label: 'frameChange' },
        { label: '{ id, frame }' },
        { plaintext: true, label: 'Fired whenever the rendered frame changes. `frame` is the new frame’s index.' }
      ]
    },
    {
      items: [
        { label: 'finish' },
        { label: '{ id }' },
        { plaintext: true, label: 'Fired when the sequence has played the configured number of loops.' }
      ]
    }
  ]"
/>

## Examples

### Playback Controls

<ComponentPreview src="./demo/PlayPauseDemo.vue" />

### Custom Colors

<ComponentPreview src="./demo/CustomColorDemo.vue" />
