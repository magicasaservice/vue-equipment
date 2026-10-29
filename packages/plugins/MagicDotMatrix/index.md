# MagicDotMatrix

MagicDotMatrix is a dot matrix display for playing frame based animations on a grid of dots, complete with a set of ready made sequence presets.

::component-preview{src="./demo/DefaultDemo.vue"}
::

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

## Installation

### CLI

Add `@maas/vue-equipment` to your dependencies.

::package-install{name="@maas/vue-equipment"}
::

### Vue

If you are using Vue, import and add `MagicDotMatrixPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicDotMatrixPlugin } from '@maas/vue-equipment/plugins/MagicDotMatrix'

const app = createApp({})

app.use(MagicDotMatrixPlugin)
```

### Nuxt

The dot matrix is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicDotMatrix` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicDotMatrix'],
  },
})
```

### Direct Import

If you prefer a more granular approach, the dot matrix can also be directly imported into any Vue component.

```vue
<script setup>
import { MagicDotMatrix } from '@maas/vue-equipment/plugins/MagicDotMatrix'
</script>

<template>
  <magic-dot-matrix id="your-dot-matrix-id" :sequence="sequence" />
</template>
```

### Composable

Playback is controlled through the `useMagicDotMatrix` composable. Import and call it with the matching id.

```js
import { useMagicDotMatrix } from '@maas/vue-equipment/plugins/MagicDotMatrix'

const { play, pause, restart, isPlaying, currentFrame } =
  useMagicDotMatrix('your-dot-matrix-id')
```

::tip
If you have installed the dot matrix as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.
::

## Peer Dependencies

MagicDotMatrix has no optional peer dependencies. It only relies on the [core peer dependencies](/overview/getting-started#core), which npm, pnpm and bun install automatically.

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
        description: A unique id, connecting the component to its composable.
      - label: MaybeRef<string>
        escape: true
      - label: 'true'
  - items:
      - label: sequence
        description: The animation to play. Refer to [sequences](#sequences) for its shape.
      - label: DotMatrixSequence
      - label: 'true'
  - items:
      - label: options
        description: Refer to the [options table](#options) for details.
      - label: MagicDotMatrixOptions
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
      - label: cols
        description: The number of columns in the grid.
      - label: number
      - label: '7'
  - items:
      - label: rows
        description: The number of rows in the grid.
      - label: number
      - label: '7'
  - items:
      - label: interval
        description: The time between frames in milliseconds.
      - label: number
      - label: '100'
  - items:
      - label: loop
        description: How often the sequence plays. Set to `true` to loop forever, `false` to play once or a number to play that many times.
      - label: boolean | number
      - label: 'true'
  - items:
      - label: autoplay
        description: Whether the sequence starts playing once the component is mounted.
      - label: boolean
      - label: 'true'
---
::

### Sequences

A sequence is an array of frames, where each frame is an array of active dot indices. Dots are indexed row by row, starting top left. Either generate sequences with one of the [presets](#presets), or author them by hand.

```js
const sequence = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
]
```

To light dots in more than one color, pass a frame as an array of layers. Each layer lists dot indices, and the dots of the n-th layer take their color from `--magic-dot-matrix-color-{n}`. If a dot appears in several layers, the last one wins.

```js
const sequence = [
  [[0, 1], [2]],
  [[3, 4], [5]],
]
```

### Presets

The plugin ships with a set of sequence generators. Each takes the grid dimensions and returns a complete sequence.

::docs-table
---
columns:
  - label: Preset
  - label: Description
rows:
  - items:
      - label: createRipple
      - plaintext: true
        label: Concentric rings expanding from the center and contracting back.
  - items:
      - label: createPulse
      - plaintext: true
        label: A filled circle growing from the center and shrinking back.
  - items:
      - label: createComet
      - plaintext: true
        label: A comet with a short trail orbiting the grid’s perimeter.
  - items:
      - label: createOrbit
      - plaintext: true
        label: A single dot traveling along the grid’s perimeter.
  - items:
      - label: createScan
      - plaintext: true
        label: A horizontal line sweeping from top to bottom.
  - items:
      - label: createEqualizer
      - plaintext: true
        label: Audio equalizer style columns rising and falling.
  - items:
      - label: createCheckerboard
      - plaintext: true
        label: Alternating checkerboard fields.
  - items:
      - label: createFocus
      - plaintext: true
        label: Rings collapsing into the center and expanding back out.
  - items:
      - label: createFill
      - plaintext: true
        label: Dots filling the grid one by one, top to bottom.
  - items:
      - label: createSpiral
      - plaintext: true
        label: The grid filling along a clockwise spiral.
  - items:
      - label: createBounce
      - plaintext: true
        label: A row sweeping down and back up, alternating direction.
  - items:
      - label: createDrift
      - plaintext: true
        label: A soft blob drifting organically around the grid.
---
::

For custom sequences the underlying helpers are exported as well: `toIndex`, `getRings`, `ringPath`, `withTrail` and `equalizerFrame`.

### useMagicDotMatrix

The composable returns the component’s state as well as functions to control playback.

::docs-table
---
columns:
  - label: Property
  - label: Type
  - label: Description
rows:
  - items:
      - label: state
      - label: DotMatrixState
      - plaintext: true
        label: The component’s reactive state.
  - items:
      - label: isPlaying
      - label: ComputedRef<boolean>
        escape: true
      - plaintext: true
        label: Whether the sequence is currently playing.
  - items:
      - label: currentFrame
      - label: ComputedRef<number>
        escape: true
      - plaintext: true
        label: The index of the currently rendered frame.
  - items:
      - label: play
      - label: () => void
      - plaintext: true
        label: Start or resume playback.
  - items:
      - label: pause
      - label: () => void
      - plaintext: true
        label: Pause playback.
  - items:
      - label: restart
      - label: () => void
      - plaintext: true
        label: Reset the sequence to its first frame and start playing.
---
::

### useMagicDotMatrixEmoji

::warning
`useMagicDotMatrixEmoji` is experimental. Its options, return values and motions may change, and it may be removed again in a future release.
::

The emoji composable turns any emoji into an animated sequence. It picks a motion that fits the emoji, such as a swing for a bell or rain for a cloud, draws every frame onto a canvas and samples it down to the grid. Bind the returned values to the dot matrix.

```vue
<template>
  <magic-dot-matrix
    id="your-dot-matrix-id"
    :sequence="sequence"
    :options="options"
    :style="style"
  />
</template>

<script setup>
import { useMagicDotMatrixEmoji } from '@maas/vue-equipment/plugins/MagicDotMatrix'

const { sequence, options, style } = useMagicDotMatrixEmoji('🔥')
</script>
```

Since the canvas only exists in the browser, the sequence stays empty during server-side rendering and fills in once the component has mounted. The emoji is drawn with the system’s emoji font, so the result differs between platforms.

#### Options

Pass the options as the second argument. Both arguments can be refs or getters, and the sequence is drawn again when they change.

::docs-table
---
columns:
  - label: Option
  - label: Type
  - label: Default
rows:
  - items:
      - label: cols
        description: The number of columns the emoji is sampled onto.
      - label: number
      - label: '10'
  - items:
      - label: rows
        description: The number of rows the emoji is sampled onto.
      - label: number
      - label: '10'
  - items:
      - label: colors
        description: The maximum number of colors taken from the emoji. Particles and the shine add their own.
      - label: number
      - label: '6'
  - items:
      - label: threshold
        description: How much of a dot the emoji has to cover for the dot to light up, from 0 to 1.
      - label: number
      - label: '0.38'
---
::

#### Return Values

::docs-table
---
columns:
  - label: Property
  - label: Type
  - label: Description
rows:
  - items:
      - label: sequence
      - label: ComputedRef<DotMatrixLayeredFrame[]>
        escape: true
      - plaintext: true
        label: The animation’s frames, with one layer per color.
  - items:
      - label: options
      - label: ComputedRef<MagicDotMatrixOptions>
        escape: true
      - plaintext: true
        label: The grid size and the motion’s frame interval.
  - items:
      - label: style
      - label: ComputedRef<Record<string, string>>
        escape: true
      - plaintext: true
        label: The colors as `--magic-dot-matrix-color-{n}` variables, plus an inactive color tinted by the most common one.
  - items:
      - label: motion
      - label: ComputedRef<DotMatrixEmojiMotion>
        escape: true
      - plaintext: true
        label: The name of the picked motion.
---
::

### CSS Variables

The dots’ geometry and colors are styled through CSS. The component fills its container and derives the dot size from the available width, the number of columns and the gap.

::docs-table
---
columns:
  - label: Variable
  - label: Default
rows:
  - items:
      - label: --magic-dot-matrix-gap
        description: The gap between dots. Takes any CSS length except percentages, `cqi` values scale with the component. The default keeps a 3:1 dot to gap ratio.
      - label: calc(100cqi / (4 * cols - 1))
  - items:
      - label: --magic-dot-matrix-radius
        description: Each dot’s corner radius as a fraction of the dot size. Set to `0.5` for circles, `0` for squares.
      - label: '0.33'
  - items:
      - label: --magic-dot-matrix-color
        description: The color of active dots.
      - label: currentColor
  - items:
      - label: --magic-dot-matrix-color-{n}
        description: The color of active dots in a frame’s n-th layer. Single color frames are drawn as the first layer.
      - label: var(--magic-dot-matrix-color)
  - items:
      - label: --magic-dot-matrix-inactive-color
        description: The color of inactive dots.
      - label: color-mix(in srgb, currentColor 15%, transparent)
  - items:
      - label: --magic-dot-matrix-background
      - label: transparent
  - items:
      - label: --magic-dot-matrix-transition
        description: A transition applied to each dot’s fill.
      - label: none
---
::

## Events

The dot matrix emits the following events through [MagicEmitter](/plugins/MagicEmitter). Listen to them with `useMagicEmitter`.

::docs-table
---
columns:
  - label: Event
  - label: Payload
  - label: Description
rows:
  - items:
      - label: finish
      - label: '{ id }'
      - plaintext: true
        label: Fired when the sequence has played the configured number of loops.
---
::

## Examples

### Presets

::component-preview{src="./demo/PresetsDemo.vue"}
::

### Playback Controls

::component-preview{src="./demo/PlayPauseDemo.vue"}
::

### Custom Colors

::component-preview{src="./demo/CustomColorDemo.vue"}
::

### Layers

::component-preview{src="./demo/EmojiDemo.vue"}
::

### Emoji

The example passes the emoji in the input to [useMagicDotMatrixEmoji](#usemagicdotmatrixemoji). The badge shows the motion it picked.

::component-preview{src="./demo/EmojiInputDemo.vue"}
::

## Inspiration

MagicDotMatrix is inspired by [Dot Matrix](https://dotmatrix.zzzzshawn.cloud/).
