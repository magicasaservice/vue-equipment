# MagicTray

MagicTray is a flexible, touch enabled, unstyled component that clips its content with a draggable, snapping clip path. Useful for things like peeking panels, reveal effects, resizable previews and the like.

::component-preview{src="./demo/DefaultDemo.vue"}
::

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
    <magic-tray-trigger side="left">
      <!-- content that drags the left side -->
    </magic-tray-trigger>
    <magic-tray-content>
      <!-- your content -->
      <template #handle="{ side }">
        <!-- custom handle for `side` -->
      </template>
    </magic-tray-content>
  </magic-tray-provider>
</template>
```

## Installation

### CLI

Add `@maas/vue-equipment` to your dependencies.

::package-install{name="@maas/vue-equipment"}
::

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
  MagicTrayTrigger,
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

::tip
If you have installed the tray as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.
::

## Peer Dependencies

MagicTray has no optional peer dependencies. It only relies on the [core peer dependencies](/overview/getting-started#core), which npm, pnpm and bun install automatically.

## API Reference

### MagicTrayProvider

The MagicTrayProvider wraps the tray and configures all child components according to the provided [options](#options).

#### Props

::docs-table
---
columns:
  - label: Prop
  - label: Type
  - label: Required
rows:
  - items:
      - label: id
        description: Providing an id is required. Can either be a string or a ref.
      - label: MaybeRef<string>
        escape: true
      - label: 'true'
  - items:
      - label: options
        description: Refer to the [options table](#options) for details.
      - label: MagicTrayOptions
      - label: 'false'
---
::

#### Options

To customize the tray, override the necessary options. Any custom options will be merged with the default options.

::docs-table
---
columns:
  - label: Option
  - label: Type
  - label: Default
rows:
  - items:
      - label: tag
        description: Specify the tray’s HTML element.
      - label: string
        description: "'div' | 'dialog' | 'main' | 'section' | 'article' | 'aside' | 'nav'"
      - label: "'div'"
  - items:
      - label: snapPoints
        description: "Snap points per side. A side becomes draggable as soon as it has at least one snap point. Each point is the inset from that edge, either a decimal between 0 and 1, a pixel value, like '120px', or a range with min, max and optionally momentum, i.e. `{ min: 0.25, max: 0.75, momentum: false }`."
      - label: TraySnapPoints
        description: 'Partial<Record<MagicTraySide, Array<MagicTraySnapPoint | { min: MagicTraySnapPoint; max: MagicTraySnapPoint; momentum?: boolean }>>>'
      - label: '{ bottom: [0, 0.5, 1] }'
  - items:
      - label: snap.mode
        description: Configure how the tray settles after a drag. 'closest' snaps to the nearest point in the drag direction, 'step' always advances one point at a time. A range snap point is split into its min and max values.
      - label: "'closest' | 'step'"
      - label: "'closest'"
  - items:
      - label: drag.mode
        description: "How a side follows the pointer. 'free' follows it and settles on release. 'snap' commits straight to the closest snap point while dragging: a hard cut, no animation, and ignores snap.mode. Inside a range, 'snap' follows the pointer and emits its snap events on release. Set per side with an object."
      - label: "'free' | 'snap' | Partial<Record<MagicTraySide, 'free' | 'snap'>>"
      - label: "'free'"
  - items:
      - label: handles
        description: Render the built-in, invisible drag handles. Set to false to disable all handles, or pass a per side object to enable handles selectively.
      - label: boolean | Partial<Record<MagicTraySide, boolean>>
      - label: 'true'
  - items:
      - label: magnetism.sides
        description: "Enable the magnetic pull per side by mapping its snap points to a direction: 'inner' pulls in as the cursor nears from inside, 'outer' out from outside, 'both' from either side. Set to false to disable. Each snap point used must also exist in snapPoints, either as a point or as the end of a range."
      - label: false | Partial<Record<MagicTraySide, Partial<Record<MagicTraySnapPoint, 'inner' | 'outer' | 'both'>>>>
      - label: 'false'
  - items:
      - label: magnetism.radius
        description: Configure the band the cursor scrubs the pull across, in pixels measured from the clipped edge. Pass `{ start, stop }` where `start` is where the pull engages and `stop` where it tops out and latches. A single number is shorthand for a band that ramps straight to the edge.
      - label: 'number | { start?: number; stop?: number }'
      - label: '0'
  - items:
      - label: magnetism.pull
        description: Configure the maximum distance in pixels the edge is pulled toward the cursor. Defaults to a quarter of the handle’s thickness.
      - label: number
      - label: '0'
  - items:
      - label: magnetism.easing
        description: Configure the easing the pull follows across the band.
      - label: EasingKey
      - label: "'easeInOutQuad'"
  - items:
      - label: magnetism.virtual
        description: Run all magnetism calculations without moving the clip path or handle. Geometry, scrubbing, and latching still run and the `magnet` event still fires. Useful for driving custom effects purely through events.
      - label: boolean
      - label: 'false'
  - items:
      - label: threshold.lock
        description: The distance in px a press may travel and still count as a tap on release. A tap returns to rest and passes its click through. Past it the release snaps and the click is swallowed.
      - label: number
      - label: '8'
  - items:
      - label: threshold.distance
        description: Configure the dragged distance before the side snaps to the next snap point in the drag direction. A drag that starts inside a range counts the distance from the range’s nearer end.
      - label: number
      - label: '128'
  - items:
      - label: threshold.momentum
        description: Configure the drag speed, in pixels per millisecond, past which a release snaps to the next point in the drag direction, even short of threshold.distance or inside a range, unless the range sets momentum to false.
      - label: number
      - label: '1'
  - items:
      - label: animation.snap.duration
        description: Configure the snap animation duration.
      - label: number
      - label: '300'
  - items:
      - label: animation.snap.easing
        description: Configure the snap animation easing.
      - label: function
      - label: function
        description: (t) => t * (2 - t)
  - items:
      - label: initial.snapPoints
        description: Optionally provide an initial snap point per side for the tray to snap to. Any value inside a range is valid. Anything else logs a warning and is ignored.
      - label: Partial<Record<MagicTraySide, MagicTraySnapPoint>>
      - label: —
  - items:
      - label: initial.transition
        description: Transition the tray into its initial snap points on mount, easing in from the open extreme instead of jumping.
      - label: boolean
      - label: 'false'
  - items:
      - label: preventEdgeNavigation
        description: Cancel `touchstart` on handles near the viewport edge on iOS to keep the browser’s navigation swipe from hijacking the drag.
      - label: boolean
      - label: 'true'
  - items:
      - label: disabled
        description: Disable all tray interactions.
      - label: boolean
      - label: 'false'
  - items:
      - label: inset
        description: Position the content absolutely and offset it by `--magic-tray-drag-overshoot-outer` on every side, so the reserved overshoot padding bleeds outside a clipping parent instead of into the visible peek.
      - label: boolean
      - label: 'false'
---
::

### MagicTrayContent

Renders the clipped content along with drag and snap behavior. Combines all four sides into a single `clip-path`.

#### Slots

::docs-table
---
columns:
  - label: Slot
  - label: Description
rows:
  - items:
      - label: default
      - plaintext: true
        label: The content that gets clipped.
  - items:
      - label: background
      - plaintext: true
        label: A layer that fills the full content element, including the reserved overshoot padding. Useful to give the tray a background that stays visible while overdragging.
  - items:
      - label: handle
      - plaintext: true
        label: Custom handle visuals. Rendered once per draggable side and scoped with the respective `side`.
---
::

#### CSS Variables

::docs-table
---
columns:
  - label: Variable
  - label: Default
rows:
  - items:
      - label: --magic-tray-radius
      - label: 0px
  - items:
      - label: --magic-tray-radius-top-left
      - label: var(--magic-tray-radius)
  - items:
      - label: --magic-tray-radius-top-right
      - label: var(--magic-tray-radius)
  - items:
      - label: --magic-tray-radius-bottom-right
      - label: var(--magic-tray-radius)
  - items:
      - label: --magic-tray-radius-bottom-left
      - label: var(--magic-tray-radius)
  - items:
      - label: --magic-tray-clip-top
      - label: –
  - items:
      - label: --magic-tray-clip-right
      - label: –
  - items:
      - label: --magic-tray-clip-bottom
      - label: –
  - items:
      - label: --magic-tray-clip-left
      - label: –
  - items:
      - label: --magic-tray-drag-overshoot
      - label: 3rem
  - items:
      - label: --magic-tray-drag-overshoot-outer
      - label: var(--magic-tray-drag-overshoot)
  - items:
      - label: --magic-tray-drag-overshoot-inner
      - label: var(--magic-tray-drag-overshoot)
  - items:
      - label: --magic-tray-position
      - label: relative
  - items:
      - label: --magic-tray-display
      - label: inline-block
  - items:
      - label: --magic-tray-width
      - label: max-content
  - items:
      - label: --magic-tray-height
      - label: max-content
  - items:
      - label: --magic-tray-max-width
      - label: none
  - items:
      - label: --magic-tray-max-height
      - label: none
  - items:
      - label: --magic-tray-bg-z-index
      - label: '-1'
  - items:
      - label: --magic-tray-content-pointer-events
      - label: auto
---
::

### MagicTrayHandle

Renders an invisible, draggable hit area along an edge. Has no appearance of its own — provide visuals through the handle slot. Rendered automatically by `MagicTrayContent` for each draggable side.

#### Slot Props

::docs-table
---
columns:
  - label: Prop
  - label: Type
  - label: Description
rows:
  - items:
      - label: side
      - label: MagicTraySide
        description: "'top' | 'right' | 'bottom' | 'left'"
      - plaintext: true
        label: The side this handle controls.
---
::

#### CSS Variables

::docs-table
---
columns:
  - label: Variable
  - label: Default
rows:
  - items:
      - label: --magic-tray-handle-width-x
      - label: 100%
  - items:
      - label: --magic-tray-handle-width-y
      - label: 4rem
  - items:
      - label: --magic-tray-handle-width-top
      - label: var(--magic-tray-handle-width-x)
  - items:
      - label: --magic-tray-handle-width-bottom
      - label: var(--magic-tray-handle-width-x)
  - items:
      - label: --magic-tray-handle-width-left
      - label: var(--magic-tray-handle-width-y)
  - items:
      - label: --magic-tray-handle-width-right
      - label: var(--magic-tray-handle-width-y)
  - items:
      - label: --magic-tray-handle-height-x
      - label: 4rem
  - items:
      - label: --magic-tray-handle-height-y
      - label: 100%
  - items:
      - label: --magic-tray-handle-height-top
      - label: var(--magic-tray-handle-height-x)
  - items:
      - label: --magic-tray-handle-height-bottom
      - label: var(--magic-tray-handle-height-x)
  - items:
      - label: --magic-tray-handle-height-left
      - label: var(--magic-tray-handle-height-y)
  - items:
      - label: --magic-tray-handle-height-right
      - label: var(--magic-tray-handle-height-y)
  - items:
      - label: --magic-tray-handle-offset-x-top
      - label: 0%
  - items:
      - label: --magic-tray-handle-offset-x-right
      - label: 50%
  - items:
      - label: --magic-tray-handle-offset-x-bottom
      - label: 0%
  - items:
      - label: --magic-tray-handle-offset-x-left
      - label: -50%
  - items:
      - label: --magic-tray-handle-offset-y-top
      - label: -50%
  - items:
      - label: --magic-tray-handle-offset-y-right
      - label: 0%
  - items:
      - label: --magic-tray-handle-offset-y-bottom
      - label: 50%
  - items:
      - label: --magic-tray-handle-offset-y-left
      - label: 0%
  - items:
      - label: --magic-tray-handle-cursor
      - label: grab
  - items:
      - label: --magic-tray-handle-cursor-dragging
      - label: grabbing
  - items:
      - label: --magic-tray-handle-z-index
      - label: '1'
---
::

### MagicTrayTrigger

Makes an element a drag surface for one side of the tray, so the user can drag a sidebar or panel shut from anywhere on it. Nest it inside `MagicTrayProvider`, or place it anywhere in your app and pass the tray’s `id`.

```vue
<template>
  <magic-tray-trigger id="your-tray-id" side="left" as-child>
    <aside>
      <!-- your sidebar -->
    </aside>
  </magic-tray-trigger>
</template>
```

A press starts the drag right away, so the side follows the pointer from the first pixel. A release within `threshold.lock` counts as a tap and passes its click to the element inside, while a longer drag swallows it. Presses on form fields and editable text never start a drag, and links and images inside the trigger never start a native drag while the side is being dragged.

#### Props

::docs-table
---
columns:
  - label: Prop
  - label: Type
  - label: Required
rows:
  - items:
      - label: id
        description: The tray id. Only required when the trigger is used outside a `MagicTrayProvider`.
      - label: MaybeRef<string>
        escape: true
      - label: 'false'
  - items:
      - label: side
        description: The side the trigger drags. A side without snap points ignores the trigger.
      - label: MagicTraySide
        description: "'top' | 'right' | 'bottom' | 'left'"
      - label: 'true'
  - items:
      - label: disabled
        description: Disable the trigger. The trigger is also disabled while the tray’s `disabled` option is set.
      - label: boolean
      - label: 'false'
  - items:
      - label: preventEdgeNavigation
        description: Cancel `touchstart` near the viewport edge on iOS to keep the browser’s navigation swipe from hijacking the drag. Defaults to the option set on `MagicTrayProvider` if not provided.
      - label: boolean
      - label: 'false'
  - items:
      - label: asChild
        description: Prevent the component from rendering its own element and pass all functionality to the child element instead.
      - label: boolean
      - label: 'false'
---
::

#### Slot Props

::docs-table
---
columns:
  - label: Prop
  - label: Type
  - label: Description
rows:
  - items:
      - label: dragging
      - label: boolean
      - plaintext: true
        label: Whether this trigger is dragging its side.
  - items:
      - label: disabled
      - label: boolean
      - plaintext: true
        label: Whether the trigger is currently disabled.
---
::

#### CSS Variables

::docs-table
---
columns:
  - label: Variable
  - label: Default
rows:
  - items:
      - label: --magic-tray-trigger-touch-action
      - label: pan-y
        description: pan-x on the top and bottom sides. A disabled trigger leaves touch-action as it is.
---
::

### MagicTrayTransform

Translates a nested layer alongside the clip. As an edge is dragged inward, the wrapped content is pushed away from that edge by the same distance, while a `background` layer stays anchored.

#### Props

::docs-table
---
columns:
  - label: Prop
  - label: Type
  - label: Default
rows:
  - items:
      - label: axis
        description: Restrict the translation to a single axis.
      - label: MagicTrayTransformAxis
        description: "'x' | 'y' | 'both'"
      - label: "'both'"
  - items:
      - label: factor
        description: Scale the translation relative to the clipped distance.
      - label: number
      - label: '1'
  - items:
      - label: disabled
        description: Disable the translation, leaving the layer anchored.
      - label: boolean
      - label: 'false'
---
::

### MagicTray

A self-contained component that composes the provider and content internally. Use this for simple, inline cases where you don’t need custom markup.

#### Props

::docs-table
---
columns:
  - label: Prop
  - label: Type
  - label: Required
rows:
  - items:
      - label: id
        description: Providing an id is required. Can either be a string or a ref.
      - label: MaybeRef<string>
        escape: true
      - label: 'true'
  - items:
      - label: options
        description: Refer to the [options table](#options) for details.
      - label: MagicTrayOptions
      - label: 'false'
---
::

#### Slots

::docs-table
---
columns:
  - label: Slot
  - label: Description
rows:
  - items:
      - label: default
      - plaintext: true
        label: The content that gets clipped.
  - items:
      - label: background
      - plaintext: true
        label: A layer that fills the full content element, including the reserved overshoot padding.
  - items:
      - label: handle
      - plaintext: true
        label: Custom handle visuals. Rendered once per draggable side and scoped with the respective `side`.
---
::

### useMagicTray

The composable returns the tray’s reactive state and a set of functions to control it programmatically.

::docs-table
---
columns:
  - label: Property
  - label: Type
  - label: Description
rows:
  - items:
      - label: progress
      - label: Ref<Record<MagicTraySide, number>>
        escape: true
      - plaintext: true
        label: Per side inset progress, 0 (open) to 1 (fully clipped).
  - items:
      - label: activeSnapPoint
      - label: Ref<Partial<Record<MagicTraySide, MagicTraySnapPoint>>>
        escape: true
      - plaintext: true
        label: The snap point each side is currently snapped to, as configured. Inside a range, the value the side rests at, to four decimals if both ends of the range are decimals and in whole pixels otherwise.
  - items:
      - label: snapTo
      - label: (side, snapPoint, duration?) => void
      - plaintext: true
        label: Snap a single side to a snap point or a value inside a range, optionally overriding the animation duration. Snap point must be a valid snap point or inside a range.
---
::

## Events

The tray emits the following events through [MagicEmitter](/plugins/MagicEmitter). Listen to them with `useMagicEmitter`.

::docs-table
---
columns:
  - label: Event
  - label: Payload
  - label: Description
rows:
  - items:
      - label: beforeDrag
      - label: '{ id, side, value }'
      - plaintext: true
        label: Fired when a side starts being dragged.
  - items:
      - label: drag
      - label: '{ id, side, value }'
      - plaintext: true
        label: Fired continuously while a side is dragged. `value` is the current inset in pixels.
  - items:
      - label: afterDrag
      - label: '{ id, side, value }'
      - plaintext: true
        label: Fired when a side stops being dragged.
  - items:
      - label: beforeSnap
      - label: '{ id, snapPoint: { side, point } }'
      - plaintext: true
        label: Fired before a side animates to a snap point.
  - items:
      - label: snapTo
      - label: '{ id, snapPoint: { side, point }, duration? }'
      - plaintext: true
        label: Fired when a side is asked to snap programmatically.
  - items:
      - label: afterSnap
      - label: '{ id, snapPoint: { side, point } }'
      - plaintext: true
        label: Fired after a side has settled on a snap point.
  - items:
      - label: progress
      - label: '{ id, side, value }'
      - plaintext: true
        label: Fired whenever a side’s inset progress changes. `value` is between 0 and 1.
  - items:
      - label: magnet
      - label: '{ id, side, value }'
      - plaintext: true
        label: 'Fired whenever a magnetic pull changes, e.g. to drive a parallax in the handle slot. `value` is the pull as a fraction of `magnetism.pull`, signed by direction: positive when pulled inward, negative when pulled outward, 0 at rest.'
  - items:
      - label: willSnapTo
      - label: '{ id, side, snapPoint }'
      - plaintext: true
        label: Fired during a drag when the committed snap target changes, i.e. the snap point the edge will animate to on release. Only fires when the target actually changes, not on every move. Inside a range, it fires once on entering, with the value at that moment.
---
::

## Errors

::docs-table
---
columns:
  - label: Source
  - label: Error Code
  - label: Message
rows:
  - items:
      - label: MagicTrayContent
      - label: missing_instance_id
      - plaintext: true
        label: MagicTrayContent must be nested inside MagicTrayProvider
  - items:
      - label: MagicTrayTransform
      - label: missing_instance_id
      - plaintext: true
        label: MagicTrayTransform must be nested inside MagicTrayProvider
  - items:
      - label: MagicTrayTrigger
      - label: missing_instance_id
      - plaintext: true
        label: MagicTrayTrigger must be nested inside MagicTrayProvider or an id must be provided
---
::

## Caveats

The tray handles situations where dragging and scrolling might interfere with each other on touch devices. In order for the tray to differentiate when the user scrolls and when the user drags, any scrollable containers within the tray need to have their overflow value explicitly set to `auto` or `scroll`.

On iOS, a touch that starts near a vertical viewport edge arms the browser’s back and forward navigation swipe, in Safari as well as in installed web apps. Since a closed side’s handle sits exactly there, the tray cancels `touchstart` on its handles and triggers within 44px of either edge, which is the one signal WebKit honors, so grabbing a handle drags the tray instead of navigating. Canceling also swallows the tap’s synthesized click; the tray dispatches a replacement when the touch ends within 12px of where it started, so click listeners keep firing. A touch on an SVG icon counts as well, and its replacement click goes to the HTML element that holds the icon. A canceled touch never scrolls either. Set the `preventEdgeNavigation` prop to `false` on a trigger whose content needs to scroll next to a viewport edge, and the option to `false` to opt out for the whole tray.

The clip insets hide part of the content, but the content still covers the whole tray. Taps respect the clip, so an element showing through the clipped area receives them. On iOS, the native hit test that decides which scroller takes a pan ignores the clip, so a scrollable element behind the clipped area never scrolls. Set `--magic-tray-content-pointer-events` to `none` while that area needs to scroll, for example while a side is open over a sidebar. Content that sets its own `pointer-events` still catches touches.

While a handle is being dragged, the tray disables text selection on the whole document and restores it on release. Without this, a pointer that leaves the handle would keep extending a selection across the page. A trigger disables it only once its drag moves past `threshold.lock`, so a long press on its content still selects text.

In order for a trigger to tell a scroll from a drag on touch devices, it sets `touch-action` to `pan-y` on the left and right sides and to `pan-x` on the top and bottom: the browser scrolls along the other axis and leaves the drag axis to the tray. The browser reads `touch-action` only up to the nearest scroll container, so give any scrollable element inside a trigger the same value. Without it, a swipe along the drag axis that starts on that element cancels the drag.

A trigger starts its drag on press, so a tap on an element inside it emits `beforeDrag`, `willSnapTo`, `drag`, `beforeSnap`, `afterSnap` and `afterDrag` as well, while the side stays where it rests.

If an element inside a trigger runs its own drag, like a swipe action on a list row, stop `pointerdown` from propagating on that element. Otherwise the tray starts a drag from the same press and moves along with it.

## Examples

### Combined Sides

::component-preview{src="./demo/CombinedDemo.vue"}
::

### Transform

Translate a layer alongside the clip with `MagicTrayTransform`, pushing content away from each edge as it is dragged in.

::component-preview{src="./demo/TransformDemo.vue"}
::

### Reveal

A composed tray layered over its own container, easing into its initial snap points on mount via `initial.transition`.

::component-preview{src="./demo/RevealDemo.vue"}
::

### Step Snapping

With `snap.mode` set to `'step'`, the edge advances to the adjacent snap point on each drag instead of jumping to the closest one, moving through the configured points one at a time.

::component-preview{src="./demo/StepSnapDemo.vue"}
::

### Drag Mode

With `drag.mode` set to `'snap'`, the edge commits straight to the snap point closest to the pointer while dragging. The cut is immediate, with no animation, and ignores `snap.mode`.

::component-preview{src="./demo/DragModeDemo.vue"}
::

### Ranges

Pass `{ min, max }` in place of a snap point to let a side rest anywhere between two insets. A release inside the range does not snap, while a release outside snaps to the closest point. Momentum detection is preserved. Add `momentum: false` to disable momentum based snapping inside the range.

```ts
const options: MagicTrayOptions = {
  snapPoints: {
    left: [0, { min: 0.15, max: 0.4 }, 0.6],
  },
}
```

Events and `activeSnapPoint` report the resting value to four decimals, like `0.2734`, if both ends of the range are decimals, and in whole pixels, like `'184px'`, otherwise.

::component-preview{src="./demo/RangeDemo.vue"}
::

### Will Snap To

The `willSnapTo` event fires during a drag whenever the snap point the edge will animate to on release changes. It only fires when the target changes, not on every move.

::component-preview{src="./demo/WillSnapToDemo.vue"}
::

### Handle Click

A handle passes clicks through to its slotted content, so a clickable element inside a `handle` slot works as expected.

::component-preview{src="./demo/HandleClickDemo.vue"}
::

### Trigger

Wrap an element in `MagicTrayTrigger` to drag a side from anywhere on it. The list below sits outside the provider and passes the tray’s `id`, so dragging it closes the left side, while a tap selects an item.

::component-preview{src="./demo/TriggerDemo.vue"}
::

### Magnetic

With `magnetism.sides`, an edge is pulled toward the cursor as it nears the handle, gaining as it closes in. Each snap point sets its direction: `'inner'` pulls in from inside, `'outer'` out from outside, `'both'` from either side.

::tip
If you move the handle with `--magic-tray-handle-offset-*`, set `magnetism.radius` and `magnetism.pull` manually. Left at their defaults they derive from the handle’s position.
::

::component-preview{src="./demo/MagneticDemo.vue"}
::

### Virtual Magnetism

With `magnetism.virtual` set to `true`, magnetism is still calculated, but the clip path and handle stay put. The `magnet` event still fires, so you can drive custom effects such as transforms or parallax.

::component-preview{src="./demo/VirtualMagneticDemo.vue"}
::
