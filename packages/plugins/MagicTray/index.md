---
soon: true
---

# MagicTray <m-badge variant="accent" mode="tone" size="xs" class="-translate-y-1.5 ml-1">Soon</m-badge>

MagicTray is a flexible, touch enabled, unstyled component that clips its content with a draggable, snapping clip path. Useful for things like peeking panels, reveal effects, resizable previews and the like.

<ComponentPreview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Concept

Instead of moving an element like [MagicDrawer](../MagicDrawer/) does, MagicTray keeps its content in place and clips it with `clip-path: inset(...)`. Every side that has snap points becomes draggable. A side's snap value is the **inset amount** measured from that edge:

- `0`: the side is fully open (no clip)
- `1` or `100%`: the side is fully clipped inward
- `'120px'`: the side is clipped inward by `120px`

Snap points are configured per side and can be combined freely. While dragging, a side snaps to the closest snap point in the drag direction once the configured velocity or distance threshold is crossed. If neither threshold is reached, the side animates back to where it started. Drag a side past its outermost snap points and it meets elastic, rubber-band resistance, then springs back on release.

The two directions are tuned separately. Dragging a side _open_ past its outermost snap point bounces by `--magic-tray-drag-overshoot-outer`: to keep content visible across that overdrag without clipping anything at rest, each draggable edge reserves a band of empty padding of the same size that pushes the content inward. At rest the clip hides this padding, so the content sits flush; the padding is simply the room the edge can bounce into. Note that it adds to the tray's rendered size on draggable edges. Dragging a side _closed_ past its outermost snap point bounces by `--magic-tray-drag-overshoot-inner`, which clips further into existing content and so needs no reserved padding — set it larger than the outer bounce for more give on the way in. Both are [CSS variables](#magictraycontent).

The tray is always rendered inline and stays mounted. It has no open or closed state of its own. If you need overlay behavior, such as teleporting to the body, a backdrop or mount and unmount transitions, compose it with [MagicDrawer](../MagicDrawer/).

## Anatomy

MagicTray can be used as a single self-contained component or composed from its individual parts for full control.

### Simple

```vue
<template>
  <magic-tray
    id="your-tray-id"
    :options="{ snapPoints: { bottom: [0, 0.5, 1] } }"
  >
    <!-- your content -->
  </magic-tray>
</template>

<script setup>
const { snapTo } = useMagicTray('your-tray-id')
</script>
```

### Composed

```vue
<template>
  <magic-tray-provider id="your-tray-id" :options="options">
    <magic-tray-content>
      <!-- your content -->
      <template #handle="{ side }">
        <!-- custom handle for `side` -->
      </template>
    </magic-tray-content>
  </magic-tray-provider>
</template>
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicTrayPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicTrayPlugin } from '@maas/vue-equipment/plugins/MagicTray'

const app = createApp({})

app.use(MagicTrayPlugin)
```

### Nuxt

The tray is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicTray` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicTray'],
  },
})
```

### Direct Import

If you prefer a more granular approach, components can be directly imported.

```vue
<script setup>
import {
  MagicTrayProvider,
  MagicTrayContent,
  MagicTrayHandle,
} from '@maas/vue-equipment/plugins/MagicTray'
</script>
```

### Composable

In order to interact with the tray from anywhere within your app, we provide a `useMagicTray` composable. Import it directly when needed.

```js
import { onMounted } from 'vue'
import { useMagicTray } from '@maas/vue-equipment/plugins/MagicTray'

const { snapTo } = useMagicTray('your-tray-id')

onMounted(() => {
  snapTo('bottom', 0.5)
})
```

> [!TIP]
> If you have installed the tray as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

## Peer Dependencies

If you haven’t installed the required peer dependencies automatically, you’ll need to install the following packages manually.

<prose-table
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

### MagicTrayProvider

The MagicTrayProvider wraps the tray and configures all child components according to the provided [options](#options).

#### Props

<prose-table
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
          label: 'MagicTrayOptions'
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

#### Options

To customize the tray, override the necessary options. Any custom options will be merged with the default options.

<prose-table
  :columns="[
    { label: 'Option' },
    { label: 'Type' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        {
          label: 'tag',
          description: 'Specify the tray’s HTML element.'
        },
        {
          label: 'string',
          description: '\'div\' | \'dialog\' | \'main\' | \'section\' | \'article\' | \'aside\' | \'nav\''
        },
        {
          label: '\'div\''
        }
      ]
    },
    {
      items: [
        {
          label: 'snapPoints',
          description: 'Snap points per side. A side becomes draggable as soon as it has at least one snap point. Each point is the inset from that edge, either a decimal between 0 and 1 or an integer with px appended, like \'120px\'.'
        },
        {
          label: 'TraySnapPoints',
          description: 'Partial<Record<TraySide, Array<number + \'px\' | number>>>'
        },
        {
          label: '{ bottom: [0, 0.5, 1] }'
        }
      ]
    },
    {
      items: [
        {
          label: 'handles',
          description: 'Render the built-in, invisible drag handles. Set to false to disable all handles, or pass a per side object to enable handles selectively. Provide visuals through the handle slot.'
        },
        {
          label: 'boolean | Partial<Record<TraySide, boolean>>'
        },
        {
          label: 'true'
        }
      ]
    },
    {
      items: [
        {
          label: 'threshold.lock',
          description: 'Configure the dragged distance before the tray prevents other touch interactions.'
        },
        {
          label: 'number'
        },
        {
          label: '0'
        }
      ]
    },
    {
      items: [
        {
          label: 'threshold.distance',
          description: 'Configure the dragged distance before the side snaps to the closest snap point.'
        },
        {
          label: 'number'
        },
        {
          label: '128'
        }
      ]
    },
    {
      items: [
        {
          label: 'threshold.momentum',
          description: 'Configure the momentum from when the side snaps.'
        },
        {
          label: 'number'
        },
        {
          label: '1'
        }
      ]
    },
    {
      items: [
        {
          label: 'animation.snap.duration',
          description: 'Configure the snap animation duration.'
        },
        {
          label: 'number'
        },
        {
          label: '300'
        }
      ]
    },
    {
      items: [
        {
          label: 'animation.snap.easing',
          description: 'Configure the snap animation easing.'
        },
        {
          label: 'function'
        },
        {
          label: 'function',
          description: '(t) => t * (2 - t)'
        }
      ]
    },
    {
      items: [
        {
          label: 'initial.snapPoints',
          description: 'Optionally provide an initial snap point per side for the tray to snap to. Ignored for sides without snap points.'
        },
        {
          label: 'Partial<Record<TraySide, TraySnapPoint>>'
        },
        {
          label: '—'
        }
      ]
    },
    {
      items: [
        {
          label: 'initial.transition',
          description: 'Transition the tray into its initial snap points on mount, easing in from the open extreme instead of jumping. Uses `animation.snap`.'
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
          label: 'disabled',
          description: 'Disable all tray interactions.'
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
          label: 'inset',
          description: 'Position the content absolutely and offset it by `--magic-tray-drag-overshoot-outer` on every side, so the reserved overshoot padding bleeds outside a clipping parent instead of into the visible peek. Use it when the tray covers a same-sized, `overflow-hidden` container and you want pixel snap points to read exactly. The fallback width and height become `100%`.'
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

### MagicTrayContent

Renders the clipped content along with drag and snap behavior. Combines all four sides into a single `clip-path`.

#### Slots

<prose-table
  :columns="[
    { label: 'Slot' },
    { label: 'Description' }
  ]"
  :rows="[
    {
      items: [
        { label: 'default' },
        { plaintext: true, label: 'The content that gets clipped.' }
      ]
    },
    {
      items: [
        { label: 'background' },
        { plaintext: true, label: 'A layer that fills the full content element, including the reserved overshoot padding. Useful to give the tray a background that stays visible while overdragging.' }
      ]
    },
    {
      items: [
        { label: 'handle' },
        { plaintext: true, label: 'Custom handle visuals. Rendered once per draggable side and scoped with the respective `side`.' }
      ]
    }
  ]"
/>

#### CSS Variables

<prose-table
  :columns="[
    { label: 'Variable' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        { label: '--magic-tray-radius' },
        { label: '0px' }
      ]
    },
    {
      items: [
        { label: '--magic-tray-drag-overshoot' },
        { label: '3rem' }
      ]
    },
    {
      items: [
        { label: '--magic-tray-drag-overshoot-outer' },
        { label: 'var(--magic-tray-drag-overshoot)' }
      ]
    },
    {
      items: [
        { label: '--magic-tray-drag-overshoot-inner' },
        { label: 'var(--magic-tray-drag-overshoot)' }
      ]
    },
    {
      items: [
        { label: '--magic-tray-position' },
        { label: 'relative' }
      ]
    },
    {
      items: [
        { label: '--magic-tray-display' },
        { label: 'inline-block' }
      ]
    },
    {
      items: [
        { label: '--magic-tray-width' },
        { label: 'max-content' }
      ]
    },
    {
      items: [
        { label: '--magic-tray-height' },
        { label: 'max-content' }
      ]
    },
    {
      items: [
        { label: '--magic-tray-max-width' },
        { label: 'none' }
      ]
    },
    {
      items: [
        { label: '--magic-tray-max-height' },
        { label: 'none' }
      ]
    },
    {
      items: [
        { label: '--magic-tray-bg-z-index' },
        { label: '-1' }
      ]
    }
  ]"
/>

### MagicTrayHandle

Renders an invisible, draggable hit area along an edge. Has no appearance of its own — provide visuals through the handle slot. Rendered automatically by `MagicTrayContent` for each draggable side.

#### Slot Props

<prose-table
  :columns="[
    { label: 'Prop' },
    { label: 'Type' },
    { label: 'Description' }
  ]"
  :rows="[
    {
      items: [
        { label: 'side' },
        { label: 'TraySide', description: '\'top\' | \'right\' | \'bottom\' | \'left\'' },
        { plaintext: true, label: 'The side this handle controls.' }
      ]
    }
  ]"
/>

#### CSS Variables

<prose-table
  :columns="[
    { label: 'Variable' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        { label: '--magic-tray-handle-size' },
        { label: '2.5rem' }
      ]
    },
    {
      items: [
        { label: '--magic-tray-handle-cursor' },
        { label: 'ns-resize / ew-resize' }
      ]
    },
    {
      items: [
        { label: '--magic-tray-handle-z-index' },
        { label: '1' }
      ]
    }
  ]"
/>

### MagicTray

A self-contained component that composes the provider and content internally. Use this for simple, inline cases where you don’t need custom markup.

#### Props

<prose-table
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
          label: 'MagicTrayOptions'
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

#### Slots

<prose-table
  :columns="[
    { label: 'Slot' },
    { label: 'Description' }
  ]"
  :rows="[
    {
      items: [
        { label: 'default' },
        { plaintext: true, label: 'The content that gets clipped.' }
      ]
    },
    {
      items: [
        { label: 'background' },
        { plaintext: true, label: 'A layer that fills the full content element, including the reserved overshoot padding.' }
      ]
    },
    {
      items: [
        { label: 'handle' },
        { plaintext: true, label: 'Custom handle visuals. Rendered once per draggable side and scoped with the respective `side`.' }
      ]
    }
  ]"
/>

### useMagicTray

The composable returns the tray’s reactive state and a set of functions to control it programmatically.

<prose-table
  :columns="[
    { label: 'Property' },
    { label: 'Type' },
    { label: 'Description' }
  ]"
  :rows="[
    {
      items: [
        { label: 'progress' },
        { label: 'Ref\<Record\<TraySide, number\>\>', escape: true },
        { plaintext: true, label: 'Per side inset progress, 0 (open) to 1 (fully clipped).' }
      ]
    },
    {
      items: [
        { label: 'activeSnapPoint' },
        { label: 'Ref\<Partial\<Record\<TraySide, TraySnapPoint\>\>\>', escape: true },
        { plaintext: true, label: 'The snap point each side is currently snapped to.' }
      ]
    },
    {
      items: [
        { label: 'snapTo' },
        { label: '(side, snapPoint, duration?) => void' },
        { plaintext: true, label: 'Snap a single side to a snap point, optionally overriding the animation duration.' }
      ]
    }
  ]"
/>

## Events

The tray emits the following events through [MagicEmitter](../MagicEmitter/). Listen to them with `useMagicEmitter`.

<prose-table
  :columns="[
    { label: 'Event' },
    { label: 'Payload' },
    { label: 'Description' }
  ]"
  :rows="[
    {
      items: [
        { label: 'beforeDrag' },
        { label: '{ id, side, value }' },
        { plaintext: true, label: 'Fired when a side starts being dragged.' }
      ]
    },
    {
      items: [
        { label: 'drag' },
        { label: '{ id, side, value }' },
        { plaintext: true, label: 'Fired continuously while a side is dragged. `value` is the current inset in pixels.' }
      ]
    },
    {
      items: [
        { label: 'afterDrag' },
        { label: '{ id, side, value }' },
        { plaintext: true, label: 'Fired when a side stops being dragged.' }
      ]
    },
    {
      items: [
        { label: 'beforeSnap' },
        { label: '{ id, side, snapPoint }' },
        { plaintext: true, label: 'Fired before a side animates to a snap point.' }
      ]
    },
    {
      items: [
        { label: 'snapTo' },
        { label: '{ id, side, snapPoint, duration? }' },
        { plaintext: true, label: 'Fired when a side is asked to snap programmatically.' }
      ]
    },
    {
      items: [
        { label: 'afterSnap' },
        { label: '{ id, side, snapPoint }' },
        { plaintext: true, label: 'Fired after a side has settled on a snap point.' }
      ]
    },
    {
      items: [
        { label: 'progress' },
        { label: '{ id, side, value }' },
        { plaintext: true, label: 'Fired whenever a side’s inset progress changes. `value` is between 0 and 1.' }
      ]
    }
  ]"
/>

## Errors

<prose-table
  :columns="[
    { label: 'Source' },
    { label: 'Error Code' },
    { label: 'Message' }
  ]"
  :rows="[
    {
      items: [
        { label: 'MagicTrayContent' },
        { label: 'missing_instance_id' },
        { plaintext: true, label: 'MagicTrayContent must be nested inside MagicTrayProvider' }
      ]
    }
  ]"
/>

## Caveats

The tray handles situations where dragging and scrolling might interfere with each other on touch devices. In order for the tray to differentiate when the user scrolls and when the user drags, any scrollable containers within the tray need to have their overflow value explicitly set to `auto` or `scroll`.

## Examples

### Combined Sides

<ComponentPreview src="./demo/CombinedDemo.vue" />

### Transform

Nest `MagicTrayTransform` inside the content to translate a layer alongside the clip. As an edge is dragged inward, the wrapped content is pushed away from that edge, while anything in the `background` slot stays anchored.

<ComponentPreview src="./demo/TransformDemo.vue" />

### Reveal

A composed tray layered over its own container. The top and bottom edges snap to 8px, the left and right edges to 64px or 128px, each exposing the labels behind as an edge is dragged in. On mount the tray eases into its initial snap points from fully open via `initial.transition`. The clip-path radius is driven by `useMagicTray`'s reactive state, easing from `0` to `0.5rem` across the first 8px of clip.

The `inset` option offsets the content by `--magic-tray-drag-overshoot-outer`, so the reserved overshoot padding extends past the `overflow-hidden` container instead of eating into the visible peek — keeping pixel snap points exact while the elastic overdrag still bleeds out of frame.

<ComponentPreview src="./demo/RevealDemo.vue" />
