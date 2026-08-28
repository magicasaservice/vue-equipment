# MagicCarousel

MagicCarousel is a flexible, unstyled carousel component built on native CSS scroll snapping, complete with inertia based mouse dragging. Useful for card sliders, image galleries, product showcases and the like.

<ComponentPreview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-carousel-provider id="your-carousel-id">
    <magic-carousel-track>
      <magic-carousel-slide v-for="slide in slides" :key="slide.id">
        <!-- your content -->
      </magic-carousel-slide>
    </magic-carousel-track>

    <magic-carousel-trigger action="previous" />
    <magic-carousel-trigger action="next" />
  </magic-carousel-provider>
</template>

<script setup>
const { activeIndex } = useMagicCarousel('your-carousel-id')
</script>
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicCarouselPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicCarouselPlugin } from '@maas/vue-equipment/plugins/MagicCarousel'

const app = createApp({})

app.use(MagicCarouselPlugin)
```

### Nuxt

The carousel is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicCarousel` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicCarousel'],
  },
})
```

### Composable

In order to interact with the carousel from anywhere within your app, we provide a `useMagicCarousel` composable. Import it directly when needed.

```js
import { useMagicCarousel } from '@maas/vue-equipment/plugins/MagicCarousel'

const { next } = useMagicCarousel('your-carousel-id')

function handleClick() {
  next()
}
```

> [!TIP]
> If you have installed the carousel as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

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
pnpm install @nuxt/kit @maas/vue-primitive @vueuse/core defu
```

```sh [npm]
npm install @nuxt/kit @maas/vue-primitive @vueuse/core defu
```

```sh [yarn]
yarn add @nuxt/kit @maas/vue-primitive @vueuse/core defu
```

```sh [bun]
bun install @nuxt/kit @maas/vue-primitive @vueuse/core defu
```

:::

## API Reference

### MagicCarouselProvider

The provider wraps the carousel and provides the necessary context to its children.

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
          label: 'MagicCarouselOptions'
        },
        {
          label: 'false'
        }
      ]
    },
    {
      items: [
        {
          label: 'asChild',
          description: 'Prevent the component from rendering and pass all functionality to a child element.'
        },
        {
          label: 'boolean'
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
          label: 'loop',
          description: 'Loop the carousel infinitely. Slides are shifted around the edges to keep the track filled in both directions.'
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
          label: 'threshold.lock',
          description: 'The distance in px the pointer needs to travel before a mouse drag engages. Clicks below the threshold pass through to the slides.'
        },
        {
          label: 'number'
        },
        {
          label: '10'
        }
      ]
    },
    {
      items: [
        {
          label: 'animation.snap.duration',
          description: 'The duration in ms when snapping programmatically, through a trigger or the composable.'
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
          description: 'The easing function when snapping programmatically.'
        },
        {
          label: '(t: number) => number',
          escape: true
        },
        {
          label: 'easeOutQuad'
        }
      ]
    },
    {
      items: [
        {
          label: 'animation.momentum.friction',
          description: 'How quickly the momentum decays after the pointer is released. Lower values stop sooner.'
        },
        {
          label: 'number'
        },
        {
          label: '0.72'
        }
      ]
    },
    {
      items: [
        {
          label: 'animation.momentum.damping',
          description: 'How tightly the carousel follows the momentum. Higher values feel stiffer.'
        },
        {
          label: 'number'
        },
        {
          label: '0.12'
        }
      ]
    },
    {
      items: [
        {
          label: 'disabled',
          description: 'Disable mouse dragging. Only applies to devices with a mouse, touch devices scroll natively either way.'
        },
        {
          label: 'boolean'
        },
        {
          label: 'false'
        }
      ]
    },
  ]"
/>

### MagicCarouselTrack

The track is the scroll container. All slides need to be nested inside it.

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
          label: 'asChild',
          description: 'Prevent the component from rendering and pass all functionality to a child element.'
        },
        {
          label: 'boolean'
        },
        {
          label: 'false'
        }
      ]
    },
  ]"
/>

#### Slot Props

<ProseTable
  :columns="[
    { label: 'Prop' },
    { label: 'Type' }
  ]"
  :rows="[
    {
      items: [
        {
          label: 'activeIndex',
          description: 'The index of the currently active slide.'
        },
        {
          label: 'number'
        }
      ]
    },
    {
      items: [
        {
          label: 'progress',
          description: 'The scroll progress of the carousel, from 0 to 1.'
        },
        {
          label: 'number'
        }
      ]
    },
    {
      items: [
        {
          label: 'dragging',
          description: 'Whether the carousel is currently being dragged.'
        },
        {
          label: 'boolean'
        }
      ]
    },
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
        { label: '--magic-carousel-slides-per-view' },
        { label: '1' }
      ]
    },
    {
      items: [
        { label: '--magic-carousel-slide-size' },
        { label: 'calc((100% - (var(--magic-carousel-slides-per-view) - 1) * var(--magic-carousel-gap)) / var(--magic-carousel-slides-per-view))' }
      ]
    },
    {
      items: [
        { label: '--magic-carousel-gap' },
        { label: '0px' }
      ]
    },
    {
      items: [
        { label: '--magic-carousel-snap-type' },
        { label: 'x mandatory' }
      ]
    },
    {
      items: [
        { label: '--magic-carousel-drag-overshoot' },
        { label: '4rem' }
      ]
    },
    {
      items: [
        { label: '--magic-carousel-cursor' },
        { label: 'grab' }
      ]
    },
    {
      items: [
        { label: '--magic-carousel-cursor-dragging' },
        { label: 'grabbing' }
      ]
    },
  ]"
/>

### MagicCarouselSlide

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
          description: 'The slide’s id. Autogenerated, if left empty.'
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
          label: 'asChild',
          description: 'Prevent the component from rendering and pass all functionality to a child element.'
        },
        {
          label: 'boolean'
        },
        {
          label: 'false'
        }
      ]
    },
  ]"
/>

#### Slot Props

<ProseTable
  :columns="[
    { label: 'Prop' },
    { label: 'Type' }
  ]"
  :rows="[
    {
      items: [
        {
          label: 'active',
          description: 'Whether the slide is the currently active slide.'
        },
        {
          label: 'boolean'
        }
      ]
    },
    {
      items: [
        {
          label: 'index',
          description: 'The index of the slide.'
        },
        {
          label: 'number'
        }
      ]
    },
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
        { label: '--magic-carousel-snap-align' },
        { label: 'start' }
      ]
    },
    {
      items: [
        { label: '--magic-carousel-snap-stop' },
        { label: 'normal' }
      ]
    },
  ]"
/>

### MagicCarouselTrigger

#### Props

<ProseTable
  :columns="[
    { label: 'Prop' },
    { label: 'Type' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        {
          label: 'action',
          description: 'The action to trigger. Pass a slide’s index to scroll directly to it.'
        },
        {
          label: '\'previous\' | \'next\' | number'
        },
        {
          label: '\'next\''
        }
      ]
    },
    {
      items: [
        {
          label: 'disabled',
          description: 'Disable the trigger. Triggers also disable themselves once the carousel arrives at the respective end.'
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
          label: 'asChild',
          description: 'Prevent the component from rendering and pass all functionality to a child element.'
        },
        {
          label: 'boolean'
        },
        {
          label: 'false'
        }
      ]
    },
  ]"
/>

#### Slot Props

<ProseTable
  :columns="[
    { label: 'Prop' },
    { label: 'Type' }
  ]"
  :rows="[
    {
      items: [
        {
          label: 'active',
          description: 'Whether the trigger’s slide is the currently active slide. Only applies to triggers with a numeric action.'
        },
        {
          label: 'boolean'
        }
      ]
    },
    {
      items: [
        {
          label: 'disabled',
          description: 'Whether the trigger is disabled.'
        },
        {
          label: 'boolean'
        }
      ]
    },
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
        { label: '--magic-carousel-trigger-cursor' },
        { label: 'pointer' }
      ]
    },
    {
      items: [
        { label: '--magic-carousel-trigger-cursor-disabled' },
        { label: 'not-allowed' }
      ]
    },
  ]"
/>

## Events

The carousel emits events through the [MagicEmitter](/plugins/MagicEmitter/). Listen to them from anywhere within your app.

```js
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'

const emitter = useMagicEmitter()

emitter.on('afterSnap', (payload) => {
  console.log(payload.id, payload.snapPoint)
})
```

<ProseTable
  :columns="[
    { label: 'Event' },
    { label: 'Payload' }
  ]"
  :rows="[
    {
      items: [
        {
          label: 'beforeDrag',
          description: 'The user started dragging the carousel with a mouse.'
        },
        {
          label: '{ id: string, x: number, y: number }'
        }
      ]
    },
    {
      items: [
        {
          label: 'drag',
          description: 'The user is dragging the carousel.'
        },
        {
          label: '{ id: string, x: number, y: number }'
        }
      ]
    },
    {
      items: [
        {
          label: 'afterDrag',
          description: 'The user released the carousel after dragging.'
        },
        {
          label: '{ id: string, x: number, y: number }'
        }
      ]
    },
    {
      items: [
        {
          label: 'beforeSnap',
          description: 'The active slide is about to change.'
        },
        {
          label: '{ id: string, snapPoint: number }'
        }
      ]
    },
    {
      items: [
        {
          label: 'snapTo',
          description: 'The carousel started snapping programmatically, through a trigger or the composable.'
        },
        {
          label: '{ id: string, snapPoint: number, duration?: number }'
        }
      ]
    },
    {
      items: [
        {
          label: 'afterSnap',
          description: 'The carousel came to rest on a new slide.'
        },
        {
          label: '{ id: string, snapPoint: number }'
        }
      ]
    },
    {
      items: [
        {
          label: 'scrollEnd',
          description: 'The carousel stopped scrolling.'
        },
        {
          label: 'string'
        }
      ]
    },
  ]"
/>

## Errors

<ProseTable
  :columns="[
    { label: 'Code' },
    { label: 'Source' },
    { label: 'Message' }
  ]"
  :rows="[
    {
      items: [
        { label: 'missing_instance_id' },
        { label: 'MagicCarouselTrack' },
        { label: 'MagicCarouselTrack must be nested inside MagicCarouselProvider' }
      ]
    },
    {
      items: [
        { label: 'missing_instance_id' },
        { label: 'MagicCarouselSlide' },
        { label: 'MagicCarouselSlide must be nested inside MagicCarouselProvider' }
      ]
    },
    {
      items: [
        { label: 'missing_instance_id' },
        { label: 'MagicCarouselTrigger' },
        { label: 'MagicCarouselTrigger must be nested inside MagicCarouselProvider' }
      ]
    },
    {
      items: [
        { label: 'overshoot_unit' },
        { label: 'MagicCarouselTrack' },
        { label: '--magic-carousel-drag-overshoot needs to be specified in px or rem' }
      ]
    },
  ]"
/>

## Caveats

Snapping is configured entirely through CSS. Set `--magic-carousel-snap-type` on the track and `--magic-carousel-snap-align` on the slides — the drag physics read these values and simulate the same snapping while dragging with a mouse. Set `--magic-carousel-snap-type` to `none` to disable snapping altogether.

The same goes for the rubberband effect. `--magic-carousel-drag-overshoot` sets how far the carousel can be dragged past either end; resistance grows the closer it gets. The value needs to be specified in `px` or `rem`. Set it to `0px` to prevent overdragging entirely. The variable is ignored when `loop` is set.

Since the carousel is a native scroll container, responsive layouts don’t need any configuration. Override the CSS variables inside your own media queries instead.

```css
.your-carousel {
  --magic-carousel-slides-per-view: 2;
}

@media (min-width: 768px) {
  .your-carousel {
    --magic-carousel-slides-per-view: 4;
  }
}
```

In order for the drag physics to stay in control of the scroll position, scroll the carousel programmatically through the composable or the element’s `scrollTo` and `scrollBy` methods. Never use `scrollIntoView` to scroll a slide, as it bypasses the carousel and may interrupt an ongoing animation mid-frame.

Loop mode adds `50%` inline padding to the track, which makes percentage based slide sizes resolve to `0`. The provider is an inline-size container, so use container query units instead — `cqi` resolves against the provider’s width regardless of the track’s padding. `--magic-carousel-slides-per-view` switches to a `100cqi` basis automatically when `loop` is set.

```css
.your-carousel {
  --magic-carousel-slide-size: 40cqi;
}
```

## Examples

### Triggers

`MagicCarouselTrigger` disables itself once the carousel arrives at the respective end. The `disabled` slot prop passes that state on to your own button.

<component-preview src="./demo/TriggerDemo.vue" />

### Dots

Pass an index as `action` to snap to a specific slide. The trigger sets `data-active` while its slide is active.

<component-preview src="./demo/DotsDemo.vue" />

### Loop

<component-preview src="./demo/LoopDemo.vue" />

### Snap Alignment

Set `--magic-carousel-snap-align` to `center` to snap slides to the middle of the track. Add matching `padding-inline` so the first and last slide can reach the center.

<component-preview src="./demo/SnapAlignDemo.vue" />

### Variable Widths

Set `--magic-carousel-slide-size` to `auto` and size each slide individually. The carousel measures every slide separately, so mixed widths snap correctly.

<component-preview src="./demo/VariableWidthDemo.vue" />

### Progress

The composable exposes the scroll progress as a reactive value between `0` and `1`.

<component-preview src="./demo/ProgressDemo.vue" />

### Cover Flow

Since the carousel is a native scroll container, scroll driven animations work out of the box. The demo binds a view timeline to each slide, so the rotation follows the scroll position without any JavaScript. Browsers without support for `animation-timeline` render the slides flat.

<component-preview src="./demo/CoverFlowDemo.vue" />

### Thumbnails

Two carousels stay in sync through the composable. Clicking a thumbnail snaps the main carousel, and the main carousel’s `activeIndex` snaps the thumbnail strip along. Both remain independently draggable.

<component-preview src="./demo/ThumbnailsDemo.vue" />
