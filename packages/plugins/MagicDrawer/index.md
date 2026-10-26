# MagicDrawer

MagicDrawer is a flexible, touch enabled, unstyled drawer component. Useful for things like shopping carts, menus, as a modal replacement on mobile devices and the like.

::component-preview{src="./demo/DefaultDemo.vue"}
::

## Anatomy

MagicDrawer can be used as a single self-contained component or composed from its individual parts for full control.

### Simple

```vue
<template>
  <magic-drawer id="your-drawer-id">
    <!-- your content -->
  </magic-drawer>
</template>

<script setup>
const { open } = useMagicDrawer('your-drawer-id')
</script>
```

### Composed

```vue
<template>
  <magic-drawer-provider id="your-drawer-id">
    <magic-drawer-trigger as-child>
      <button>Open</button>
    </magic-drawer-trigger>
    <magic-drawer-teleport>
      <magic-drawer-backdrop />
      <magic-drawer-content>
        <!-- your content -->
      </magic-drawer-content>
    </magic-drawer-teleport>
  </magic-drawer-provider>
</template>
```

::tip
`MagicDrawerTeleport` is optional. Omit it to keep the drawer mounted at all times, with visibility controlled via `v-show`.
::

## Installation

### CLI

Add `@maas/vue-equipment` to your dependencies.

::package-install{name="@maas/vue-equipment"}
::

### Vue

If you are using Vue, import and add `MagicDrawerPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicDrawerPlugin } from '@maas/vue-equipment/plugins/MagicDrawer'

const app = createApp({})

app.use(MagicDrawerPlugin)
```

### Nuxt

The drawer is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicDrawer` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicDrawer'],
  },
})
```

### Direct Import

If you prefer a more granular approach, components can be directly imported.

```vue
<script setup>
import {
  MagicDrawerProvider,
  MagicDrawerTeleport,
  MagicDrawerBackdrop,
  MagicDrawerContent,
  MagicDrawerTrigger,
} from '@maas/vue-equipment/plugins/MagicDrawer'
</script>
```

### Composable

In order to interact with the drawer from anywhere within your app, we provide a `useMagicDrawer` composable. Import it directly when needed.

```js
import { onMounted } from 'vue'
import { useMagicDrawer } from '@maas/vue-equipment/plugins/MagicDrawer'

const { open } = useMagicDrawer('your-drawer-id')

onMounted(() => {
  open()
})
```

::tip
If you have installed the drawer as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.
::

## Peer Dependencies

MagicDrawer relies on the following optional peer dependencies in addition to the [core peer dependencies](/overview/getting-started#core). Package managers don’t install optional peer dependencies automatically, so add them to your project.

::docs-table
---
columns:
  - label: Package
rows:
  - items:
      - label: '[@vueuse/integrations](https://www.npmjs.com/package/@vueuse/integrations)'
  - items:
      - label: '[focus-trap](https://www.npmjs.com/package/focus-trap)'
  - items:
      - label: '[wheel-gestures](https://www.npmjs.com/package/wheel-gestures)'
---
::

### Installation

::package-install{name="@vueuse/integrations focus-trap wheel-gestures"}
::

## API Reference

### MagicDrawerProvider

The MagicDrawerProvider wraps the drawer and configures all child components according to the provided [options](#options).

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
      - label: MagicDrawerOptions
      - label: 'false'
---
::

#### Options

To customize the drawer, override the necessary options. Any custom options will be merged with the default options.

::docs-table
---
columns:
  - label: Option
  - label: Type
  - label: Default
rows:
  - items:
      - label: position
        description: Set the drawer’s position relative to the viewport.
      - label: string
        description: "'top' | 'right' | 'bottom' | 'left'"
      - label: "'bottom'"
  - items:
      - label: tag
        description: Specify the drawer’s HTML element.
      - label: string
        description: "'dialog' | 'div'"
      - label: "'dialog'"
  - items:
      - label: focusTrap
        description: Pass focus-trap options or disable completely. A complete list of options can be found [here](https://www.npmjs.com/package/focus-trap#createoptions). Make sure to disable this, if you do not have a focusable element in your drawer.
      - label: boolean | FocusTrapOptions
      - label: object
  - items:
      - label: scrollLock
        description: Lock body scroll when the drawer is open.
      - label: boolean | object
      - label: object
  - items:
      - label: scrollLock.padding
        description: Locking the body scroll hides any permanently visible scrollbar. Adding a padding to fixed elements prevents them from shifting in this case.
      - label: boolean
      - label: 'true'
  - items:
      - label: snapPoints
        description: "Add snap points. Points can either be a decimal between 0 and 1, an integer with px appended, like '768px', or a range with min, max and optionally momentum, i.e. `{ min: 0.25, max: 0.75, momentum: false }`."
      - label: MagicDrawerSnapEntry[]
        description: 'Array<MagicDrawerSnapPoint | { min: MagicDrawerSnapPoint; max: MagicDrawerSnapPoint; momentum?: boolean }>'
      - label: '[1]'
  - items:
      - label: snap.mode
        description: Configure how the drawer settles after a drag. 'closest' snaps to the nearest point in the drag direction, 'step' always advances one point at a time. A range snap point is split into its min and max values.
      - label: "'closest' | 'step'"
      - label: "'closest'"
  - items:
      - label: teleport.target
        description: Default teleport target used by `MagicDrawerTeleport` unless overridden on the component itself.
      - label: string
      - label: "'body'"
  - items:
      - label: teleport.disabled
        description: Disable teleporting entirely when using the default target.
      - label: boolean
      - label: 'false'
  - items:
      - label: transition.content
        description: Set the [transition name](https://vuejs.org/guide/built-ins/transition#named-transitions) for the drawer panel.
      - label: string
      - label: "'magic-drawer-content'"
  - items:
      - label: transition.backdrop
        description: Set the [transition name](https://vuejs.org/guide/built-ins/transition#named-transitions) for the backdrop.
      - label: string
      - label: "'magic-drawer-backdrop'"
  - items:
      - label: threshold.lock
        description: The distance in px a press may travel and still count as a tap on release. A tap returns to rest and passes its click through. Past it the release snaps and the click is swallowed.
      - label: number
      - label: '8'
  - items:
      - label: threshold.distance
        description: Configure the dragged distance before the drawer snaps. A drag that starts inside a range counts the distance from the range’s nearer end. In a range that reaches 0, a drag that ends within this distance of 0 closes the drawer.
      - label: number
      - label: '128'
  - items:
      - label: threshold.momentum
        description: Configure the drag speed, in pixels per millisecond, past which a release snaps to the next point in the drag direction, even short of threshold.distance or inside a range, unless the range sets momentum to false.
      - label: number
      - label: '1'
  - items:
      - label: animation.snap.duration
        description: Configure the drawer’s snap animation duration.
      - label: number
      - label: '300'
  - items:
      - label: animation.snap.easing
        description: Configure the drawer’s snap animation easing.
      - label: function
      - label: function
        description: (t) => t * (2 - t)
  - items:
      - label: initial.open
        description: Open the drawer as soon as the component is mounted.
      - label: boolean
      - label: 'false'
  - items:
      - label: initial.transition
        description: Animate the drawer when it opens initially. Ignored if `initial.open` is not set.
      - label: boolean
      - label: —
  - items:
      - label: initial.snapPoint
        description: Optionally provide an initial snap point for the drawer to snap to. Any value inside a range is valid. Anything else logs a warning and is ignored.
      - label: MagicDrawerSnapPoint
        description: number + 'px' | number
      - label: —
  - items:
      - label: keyListener.close
        description: Set keyboard keys to close the drawer. Set to false to disable the key listener entirely.
      - label: string[] | false
      - label: "['Escape']"
  - items:
      - label: enableMousewheel
        description: When set to true, the drawer will react to mousewheel input.
      - label: boolean
      - label: 'false'
  - items:
      - label: preventZoom
        description: Prevent viewport scaling when the drawer is open.
      - label: boolean
      - label: 'true'
  - items:
      - label: preventDragClose
        description: Prevent the drawer from being closed by dragging.
      - label: boolean
      - label: 'false'
  - items:
      - label: preventEdgeNavigation
        description: Cancel `touchstart` near the viewport edge on iOS to keep the browser’s navigation swipe from hijacking the drag. Only applies to drawers with a `left` or `right` position.
      - label: boolean
      - label: 'true'
  - items:
      - label: disabled
        description: Disable all drawer interactions.
      - label: boolean
      - label: 'false'
---
::

### MagicDrawerTeleport

Teleports all child components to a target in the DOM. Uses `v-if` to mount and unmount its contents when the drawer opens and closes — keeping the DOM clean when the drawer is inactive. Omit this component if you want the drawer to remain mounted at all times.

#### Props

::docs-table
---
columns:
  - label: Prop
  - label: Type
  - label: Required
rows:
  - items:
      - label: to
        description: Override the teleport target set in the provider options.
      - label: string | RendererElement
      - label: 'false'
  - items:
      - label: disabled
        description: Disable teleporting, rendering children in place instead.
      - label: boolean
      - label: 'false'
---
::

### MagicDrawerBackdrop

Renders a full-viewport overlay behind the drawer panel. Closes the drawer when clicked.

#### CSS Variables

::docs-table
---
columns:
  - label: Variable
  - label: Default
rows:
  - items:
      - label: --magic-drawer-backdrop-position
      - label: fixed
  - items:
      - label: --magic-drawer-backdrop-top
      - label: '0'
  - items:
      - label: --magic-drawer-backdrop-left
      - label: '0'
  - items:
      - label: --magic-drawer-backdrop-right
      - label: '0'
  - items:
      - label: --magic-drawer-backdrop-bottom
      - label: '0'
  - items:
      - label: --magic-drawer-backdrop-width
      - label: 100%
  - items:
      - label: --magic-drawer-backdrop-height
      - label: 100%
  - items:
      - label: --magic-drawer-backdrop-color
      - label: rgba(0, 0, 0, 0.5)
  - items:
      - label: --magic-drawer-backdrop-filter
      - label: unset
  - items:
      - label: --magic-drawer-backdrop-z-index
      - label: '998'
---
::

### MagicDrawerContent

Renders the drawer panel with drag, snap, and scroll behavior.

#### CSS Variables

::docs-table
---
columns:
  - label: Variable
  - label: Default
rows:
  - items:
      - label: --magic-drawer-position
      - label: fixed
  - items:
      - label: --magic-drawer-inset
      - label: '0'
  - items:
      - label: --magic-drawer-display
      - label: flex
  - items:
      - label: --magic-drawer-z-index
      - label: '999'
  - items:
      - label: --magic-drawer-height
      - label: 75svh
  - items:
      - label: --magic-drawer-width
      - label: 100%
  - items:
      - label: --magic-drawer-max-height
      - label: none
  - items:
      - label: --magic-drawer-max-width
      - label: none
  - items:
      - label: --magic-drawer-content-width
      - label: 100%
  - items:
      - label: --magic-drawer-content-height
      - label: 100%
  - items:
      - label: --magic-drawer-content-max-height
      - label: 100%
  - items:
      - label: --magic-drawer-justify-content
      - label: center
  - items:
      - label: --magic-drawer-align-items
      - label: flex-end
  - items:
      - label: --magic-drawer-enter-animation
      - label: slide-btt-in 300ms ease
  - items:
      - label: --magic-drawer-leave-animation
      - label: slide-btt-out 300ms ease
  - items:
      - label: --magic-drawer-drag-overshoot
      - label: 4rem
  - items:
      - label: --magic-drawer-cursor
      - label: grab
  - items:
      - label: --magic-drawer-cursor-dragging
      - label: grabbing
---
::

### MagicDrawerTrigger

Opens or closes the drawer on click.

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
        description: The drawer id. Only required when the trigger is used outside a `MagicDrawerProvider`.
      - label: MaybeRef<string>
        escape: true
      - label: 'false'
  - items:
      - label: disabled
        description: Disable the trigger. Defaults to the disabled state set on `MagicDrawerProvider` if not provided.
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
      - label: active
      - label: boolean
      - plaintext: true
        label: Whether the drawer is currently open.
  - items:
      - label: disabled
      - label: boolean
      - plaintext: true
        label: Whether the trigger is currently disabled.
---
::

### MagicDrawer

A self-contained component that composes all primitives internally. Use this for simple cases where you don’t need to customise the markup.

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
      - label: MagicDrawerOptions
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
        label: Content rendered inside the drawer panel.
  - items:
      - label: backdrop
      - plaintext: true
        label: Content rendered inside the backdrop element.
---
::

### useMagicDrawer

The composable returns the drawer’s reactive state and a set of functions to control it programmatically.

::docs-table
---
columns:
  - label: Property
  - label: Type
  - label: Description
rows:
  - items:
      - label: isActive
      - label: ComputedRef<boolean>
        escape: true
      - plaintext: true
        label: Whether the drawer is open.
  - items:
      - label: progress
      - label: 'Ref<{ x: number, y: number }>'
        escape: true
      - plaintext: true
        label: Drag progress per axis, 0 (closed) to 1 (open).
  - items:
      - label: activeSnapPoint
      - label: Ref<MagicDrawerSnapPoint | undefined>
        escape: true
      - plaintext: true
        label: The snap point the drawer is currently snapped to, as configured. Inside a range, the value the drawer rests at, to four decimals if both ends of the range are decimals and in whole pixels otherwise.
  - items:
      - label: open
      - label: () => void
      - plaintext: true
        label: Open the drawer.
  - items:
      - label: close
      - label: () => void
      - plaintext: true
        label: Close the drawer.
  - items:
      - label: snapTo
      - label: (snapPoint, duration?) => void
      - plaintext: true
        label: Snap the drawer to a snap point or a value inside a range, optionally overriding the animation duration. Snap point must be a valid snap point or inside a range.
---
::

## Events

The drawer emits the following events through [MagicEmitter](/plugins/MagicEmitter). Listen to them with `useMagicEmitter`.

::docs-table
---
columns:
  - label: Event
  - label: Payload
  - label: Description
rows:
  - items:
      - label: beforeEnter
      - label: id
      - plaintext: true
        label: Fired before the drawer’s open transition starts.
  - items:
      - label: enter
      - label: id
      - plaintext: true
        label: Fired when the drawer’s open transition starts.
  - items:
      - label: afterEnter
      - label: id
      - plaintext: true
        label: Fired after the drawer’s open transition ends.
  - items:
      - label: beforeLeave
      - label: id
      - plaintext: true
        label: Fired before the drawer’s close transition starts.
  - items:
      - label: leave
      - label: id
      - plaintext: true
        label: Fired when the drawer’s close transition starts.
  - items:
      - label: afterLeave
      - label: id
      - plaintext: true
        label: Fired after the drawer’s close transition ends.
  - items:
      - label: beforeDrag
      - label: '{ id, x, y }'
      - plaintext: true
        label: Fired when the drawer starts being dragged.
  - items:
      - label: drag
      - label: '{ id, x, y }'
      - plaintext: true
        label: Fired continuously while the drawer is dragged. `x` and `y` are the current translation in pixels.
  - items:
      - label: afterDrag
      - label: '{ id, x, y }'
      - plaintext: true
        label: Fired when the drawer stops being dragged.
  - items:
      - label: beforeSnap
      - label: '{ id, snapPoint }'
      - plaintext: true
        label: Fired before the drawer animates to a snap point.
  - items:
      - label: snapTo
      - label: '{ id, snapPoint, duration? }'
      - plaintext: true
        label: Fired when the drawer is asked to snap programmatically.
  - items:
      - label: afterSnap
      - label: '{ id, snapPoint }'
      - plaintext: true
        label: Fired after the drawer has settled on a snap point.
  - items:
      - label: willSnapTo
      - label: '{ id, snapPoint }'
      - plaintext: true
        label: Fired during a drag when the committed snap target changes, i.e. the snap point the drawer will animate to on release. Only fires when the target actually changes, not on every move. Inside a range, it fires once on entering, with the value at that moment.
  - items:
      - label: progress
      - label: '{ id, x, y }'
      - plaintext: true
        label: Fired whenever the drawer’s drag progress changes.
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
      - label: MagicDrawerTeleport
      - label: missing_instance_id
      - plaintext: true
        label: MagicDrawerTeleport must be nested inside MagicDrawerProvider
  - items:
      - label: MagicDrawerBackdrop
      - label: missing_instance_id
      - plaintext: true
        label: MagicDrawerBackdrop must be nested inside MagicDrawerProvider
  - items:
      - label: MagicDrawerContent
      - label: missing_instance_id
      - plaintext: true
        label: MagicDrawerContent must be nested inside MagicDrawerProvider
  - items:
      - label: MagicDrawerTrigger
      - label: missing_instance_id
      - plaintext: true
        label: MagicDrawerTrigger must be nested inside MagicDrawerProvider or an id must be provided
  - items:
      - label: MagicDrawerContent
      - label: overshoot_unit
      - plaintext: true
        label: --magic-drawer-drag-overshoot needs to be specified in px or rem
---
::

## Caveats

The drawer handles situations where dragging and scrolling might interfere with each other on touch devices. In order for the drawer to differentiate when the user scrolls and when the user drags, any scrollable containers within the drawer need to have their overflow value explicitly set to `auto` or `scroll`.

On iOS, a touch that starts near a vertical viewport edge arms the browser’s back and forward navigation swipe — in Safari as well as in installed web apps. Drawers with a `left` or `right` position drag along the same axis, so they cancel `touchstart` within 44px of either edge, which is the one signal WebKit honors, and the drag stays with the drawer. Canceling also swallows the tap’s synthesized click; the drawer dispatches a replacement when the touch ends within 12px of where it started, so taps inside the strip keep working. A touch on an SVG icon counts as well, and its replacement click goes to the HTML element that holds the icon. Scrolling cannot start inside the strip — a touch that begins there belongs to the drag. Set `preventEdgeNavigation` to `false` to opt out.

Starting with iOS 26, Safari renders page content beneath its translucent UI chrome, while `position: fixed` elements can stop short of the bottom controls. A fixed backdrop may leave a strip of undimmed content visible behind the chrome. To cover everything on screen, switch the backdrop to `position: absolute` and give it a positioned ancestor:

```css
body {
  position: relative;
  margin: 0;
}

@supports (-webkit-touch-callout: none) {
  :root {
    --magic-drawer-backdrop-position: absolute;
    --magic-drawer-backdrop-height: max(100%, 100dvh);
  }
}
```

The `@supports` query limits the override to iOS, where every browser runs WebKit. The `height` override keeps the backdrop covering the entire document on scrolled pages, while never shrinking below the viewport on short ones. Leave `--magic-drawer-position` untouched — the content needs `position: fixed` to anchor the drawer to the viewport.

The pattern relies on `body` spanning the full document and does not cover pages that scroll horizontally. If you teleport the drawer somewhere other than `body`, the new target needs to be the positioned ancestor instead.

## Examples

### Vertical

::component-preview{src="./demo/VerticalDemo.vue"}
::

### Horizontal

::component-preview{src="./demo/HorizontalDemo.vue"}
::

### Snap Points

::component-preview{src="./demo/SnapPointsDemo.vue"}
::

### Mousewheel

::component-preview{src="./demo/MousewheelDemo.vue"}
::

### Step Snapping

With `snap.mode` set to `'step'`, the drawer advances to the adjacent snap point on each drag instead of jumping to the closest one, moving through the configured points one at a time.

::component-preview{src="./demo/SnapModeDemo.vue"}
::

### Ranges

Pass `{ min, max }` in place of a snap point to let the drawer rest anywhere between two points. A release inside the range does not snap, while a release outside snaps to the closest point. Momentum detection is preserved. Add `momentum: false` to disable momentum based snapping inside the range.

```ts
const options: MagicDrawerOptions = {
  snapPoints: [{ min: 0.25, max: 0.75 }, 1],
}
```

Events and `activeSnapPoint` report the resting value to four decimals, like `0.4375`, if both ends of the range are decimals, and in whole pixels, like `'420px'`, otherwise.

::component-preview{src="./demo/RangeDemo.vue"}
::

With a range from `0` as its only snap point, the drawer rests anywhere up to the range’s end, and closes once dragged to within `threshold.distance` of the bottom.

::component-preview{src="./demo/RangeCloseDemo.vue"}
::

### Composed

::component-preview{src="./demo/ComposedDemo.vue"}
::

### Will Snap To

The `willSnapTo` event fires during a drag whenever the snap point the drawer will animate to on release changes. It only fires when the target changes, not on every move.

::component-preview{src="./demo/WillSnapToDemo.vue"}
::
