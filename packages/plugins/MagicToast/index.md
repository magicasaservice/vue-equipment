# MagicToast

MagicToast let’s you trigger and display toasts from anywhere.

<component-preview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-toast-provider id="your-toast-id" />
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { useMagicToast } from '@maas/vue-equipment/plugins/MagicToast'

const component = defineAsyncComponent(() => import('./YourToast.vue'))
const { add } = useMagicToast('your-toast-id')

function handleClick() {
  add({ component })
}
</script>
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicToastPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicToastPlugin } from '@maas/vue-equipment/plugins/MagicToast'

const app = createApp({})

app.use(MagicToastPlugin)
```

### Nuxt

The toaster is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicToast` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicToast'],
  },
})
```

### Composable

In order to interact with the toaster from anywhere within your app, we provide a `useMagicToaster` composable. Import it directly when needed.

```js
const component = defineAsyncComponent(() => import('./YourToast.vue'))
const { add } = useMagicToast('your-toast-id')

function handleClick() {
  add({ component })
}
```

> [!TIP]
> If you have installed the toaster as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

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

## API Reference

### MagicToastProvider

The MagicToastProvider wraps the toaster and configures it according to the provided [options](#options).

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
          label: 'MagicMenuOptions'
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
          label: 'debug',
          description: 'Set to true to get visual feedback on positioning.'
        },
        { label: 'boolean' },
        { label: 'false' }
      ]
    },
    {
      items: [
        { 
          label: 'position',
          description: 'Set the toaster’s position relative to the viewport.'
        },
        { label: 'Position' },
        { label: 'bottom' }
      ]
    },
    {
      items: [
        { 
          label: 'duration',
          description: 'Duration in milliseconds before the toast auto-dismisses. Set to 0 to disable.'
        },
        { label: 'number' },
        { label: '0' }
      ]
    },
    {
      items: [
        {
          label: 'draggable',
          description: 'Allow toasts to be dragged and dismissed by dragging. Set to false to disable dragging entirely.'
        },
        { label: 'boolean' },
        { label: 'true' }
      ]
    },
    {
      items: [
        {
          label: 'drag.direction',
          description: 'Force the toast to drag out to the left, right, up or down, regardless of its position. Pass a same-axis pair, e.g. [\'left\', \'right\'] or [\'up\', \'down\'], to allow dragging either way along that axis. Set to \'auto\' to derive the drag direction from the position instead.'
        },
        { 
          label: 'string | string[]',
          description: '\'auto\' | \'left\' | \'right\' | \'up\' | \'down\' | (\'left\' | \'right\')[] | (\'up\' | \'down\')[]'
        },
        { label: 'auto' }
      ]
    },
    {
      items: [
        {
          label: 'scrollLock',
          description: 'Lock body scroll when dragging a toast.'
        },
        { label: 'boolean | object' },
        { label: 'object' }
      ]
    },
    {
      items: [
        {
          label: 'scrollLock.padding',
          description: 'Locking the body scroll hides any permanently visible scrollbar. Adding a padding to fixed elements prevents them from shifting in this case.'
        },
        { label: 'boolean' },
        { label: 'true' }
      ]
    },
    {
      items: [
        {
          label: 'teleport.target',
          description: 'Specify the teleport target.'
        },
        { label: 'string' },
        { label: 'body' }
      ]
    },
    {
      items: [
        {
          label: 'teleport.disabled',
          description: 'Disable teleporting the toast completely.'
        },
        { label: 'boolean' },
        { label: 'false' }
      ]
    },
    {
      items: [
        {
          label: 'transition',
          description: 'Set the transition name for the toast.'
        },
        { label: 'string' },
        { label: 'magic-toast' }
      ]
    },
    {
      items: [
        {
          label: 'layout.expand',
          description: 'Configure wether the toasts should expand on click, hover or not at all.'
        },
        { 
          label: 'string | false',
          description: 'false | \'hover\' | \'click\''
        },
        { label: 'click' }
      ]
    },
    {
      items: [
        {
          label: 'layout.max',
          description: 'Maximum number of toasts to show at once.'
        },
        { label: 'number' },
        { label: '3' }
      ]
    },
    {
      items: [
        {
          label: 'animation.snap.duration',
          description: 'Configure the toast’s snap animation duration.'
        },
        { label: 'number' },
        { label: '300' }
      ]
    },
    {
      items: [
        {
          label: 'animation.snap.easing',
          description: 'Configure the toast’s snap animation easing function.'
        },
        { 
          label: 'function',
          description: '(t: number) => number'
        },
        { label: '—' }
      ]
    },
    {
      items: [
        {
          label: 'initial.expanded',
          description: 'Whether toasts should be expanded initially.'
        },
        { label: 'boolean' },
        { label: 'false' }
      ]
    },
    {
      items: [
        {
          label: 'threshold.lock',
          description: 'Configure the dragged distance before the toaster prevents other touch interactions.'
        },
        { label: 'number' },
        { label: '8' }
      ]
    },
    {
      items: [
        {
          label: 'threshold.distance',
          ddescription: 'Configure the dragged distance before the toast snaps.'
        },
        { label: 'number' },
        { label: '32' }
      ]
    },
    {
      items: [
        {
          label: 'threshold.momentum',
          description: 'Configure the momentum from when the toast snaps.'
        },
        { label: 'number' },
        { label: '1' }
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
        { label: '--magic-toast-padding-y' },
        { label: '1rem' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-padding-x' },
        { label: '1rem' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-gap' },
        { label: '0.75rem' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-animation-duration' },
        { label: '175ms' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-scale-factor' },
        { label: '0.05' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-overlap-y' },
        { label: '1rem' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-position' },
        { label: 'fixed' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-inset' },
        { label: '0' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-width' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-height' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-z-index' },
        { label: '999' }
      ]
    }
  ]"
/>

### MagicToastView

Renders a single toast inside the toaster. Used internally.

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        { label: '--magic-toast-view-transition' },
        { label: 'all var(--magic-toast-animation-duration) var(--ease-in-out)' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-view-cursor' },
        { label: 'grab' }
      ]
    },
    {
      items: [
        { label: '--magic-toast-view-cursor-dragging' },
        { label: 'grabbing' }
      ]
    }
  ]"
/>

### useMagicToast

Interact with a toaster instance from anywhere in your app. Pass the same `id` used on the corresponding `MagicToastProvider`.

```js
const {
  add,
  remove,
  clear,
  hide,
  show,
  expand,
  collapse,
  toasts,
  count,
  hidden,
} = useMagicToast('your-toast-id')
```

#### add

Adds a toast to the stack and returns its `id`.

<ProseTable 
  :columns="[
    { label: 'Argument' },
    { label: 'Type' },
    { label: 'Required' }
  ]"
  :rows="[
    {
      items: [
        {
          label: 'component',
          description: 'The component to render inside the toast.'
        },
        { label: 'Component' },
        { label: 'true' }
      ]
    },
    {
      items: [
        {
          label: 'props',
          description: 'Props passed to the component.'
        },
        { label: 'Record\<string, unknown\>', escape: true },
        { label: 'false' }
      ]
    },
    {
      items: [
        {
          label: 'slots',
          description: 'Slots passed to the component.'
        },
        { label: 'Slots' },
        { label: 'false' }
      ]
    },
    {
      items: [
        {
          label: 'duration',
          description: 'Overrides the toaster’s duration option for this toast. Set to 0 to disable auto-dismiss.'
        },
        { label: 'number' },
        { label: 'false' }
      ]
    },
    {
      items: [
        {
          label: 'draggable',
          description: 'Overrides the toaster’s draggable option for this toast only.'
        },
        { label: 'boolean' },
        { label: 'false' }
      ]
    },
    {
      items: [
        {
          label: 'id',
          description: 'Provide your own id instead of letting one be generated. Adding with an existing id updates that toast instead of creating a new one.'
        },
        { label: 'string' },
        { label: 'false' }
      ]
    }
  ]"
/>

```js
const id = add({ component, props: { message: 'Saved!' } })
```

#### remove

Removes a toast by id.

```js
remove(id)
```

#### clear

Removes all toasts, including any currently hidden via `hide()`. Optionally pass a transition name to use while clearing, instead of the toaster’s configured `transition` option.

```js
clear()
clear('my-clear-transition')
```

#### hide / show

Temporarily hide the entire toast stack and restore it later, preserving each toast’s state (props, timers, etc.) in between. Auto-dismiss timers are paused while hidden and resume when shown again. Both optionally take a transition name to use instead of the toaster’s configured `transition` option. Calling `hide()` with nothing to hide, or `show()` with nothing hidden, is a no-op.

Calling `add()` while the stack is hidden reveals it again immediately, so a new toast is never silently queued out of sight — it’s equivalent to calling `show()` first.

```js
hide()
show()

hide('my-hide-transition')
show('my-show-transition')
```

#### expand / collapse

Expand or collapse the toast stack, mirroring what `layout.expand: 'click' | 'hover'` does on interaction.

```js
expand()
collapse()
```

#### State

<ProseTable 
  :columns="[
    { label: 'Property' },
    { label: 'Type' },
    { label: 'Description' }
  ]"
  :rows="[
    {
      items: [
        { label: 'toasts' },
        { label: 'ComputedRef\<ToastView[]\>', escape: true },
        { label: 'The currently active toasts.' }
      ]
    },
    {
      items: [
        { label: 'count' },
        { label: 'ComputedRef\<number\>', escape: true },
        { label: 'Number of currently active toasts.' }
      ]
    },
    {
      items: [
        { label: 'hidden' },
        { label: 'ComputedRef\<number\>', escape: true },
        { label: 'Number of toasts currently stashed via hide(). Useful for disabling hide()/show() controls when there’s nothing to hide or restore.' }
      ]
    }
  ]"
/>

## Events

The toaster emits the following events through [MagicEmitter](../MagicEmitter/). Listen to them with `useMagicEmitter`.

<ProseTable
  :columns="[
    { label: 'Event' },
    { label: 'Payload' },
    { label: 'Description' }
  ]"
  :rows="[
    {
      items: [
        { label: 'beforeEnter' },
        { label: 'id' },
        { plaintext: true, label: 'Fired before a toast’s enter transition starts.' }
      ]
    },
    {
      items: [
        { label: 'enter' },
        { label: 'id' },
        { plaintext: true, label: 'Fired when a toast’s enter transition starts.' }
      ]
    },
    {
      items: [
        { label: 'afterEnter' },
        { label: 'id' },
        { plaintext: true, label: 'Fired after a toast’s enter transition ends.' }
      ]
    },
    {
      items: [
        { label: 'beforeLeave' },
        { label: 'id' },
        { plaintext: true, label: 'Fired before a toast’s leave transition starts.' }
      ]
    },
    {
      items: [
        { label: 'leave' },
        { label: 'id' },
        { plaintext: true, label: 'Fired when a toast’s leave transition starts.' }
      ]
    },
    {
      items: [
        { label: 'afterLeave' },
        { label: 'id' },
        { plaintext: true, label: 'Fired after a toast’s leave transition ends.' }
      ]
    },
    {
      items: [
        { label: 'beforeDrag' },
        { label: '{ id, x, y }' },
        { plaintext: true, label: 'Fired when a toast starts being dragged.' }
      ]
    },
    {
      items: [
        { label: 'drag' },
        { label: '{ id, x, y }' },
        { plaintext: true, label: 'Fired continuously while a toast is dragged. `x` and `y` are the current translation in pixels.' }
      ]
    },
    {
      items: [
        { label: 'afterDrag' },
        { label: '{ id, x, y }' },
        { plaintext: true, label: 'Fired when a toast stops being dragged.' }
      ]
    }
  ]"
/>

## Errors

<ProseTable
  :columns="[
    { label: 'Source' },
    { label: 'Error Code' },
    { label: 'Message' }
  ]"
  :rows="[
    { 
      items: [
        { label: 'MagicToastView' }, 
        { label: 'missing_instance_id' }, 
        { plaintext: true, label: 'MagicToastView must be used within a MagicToastProvider' }
      ] 
    }
  ]"
/>

## Examples

### Position

Set the `position` option to anchor the toaster to any edge or corner of the viewport.

<component-preview src="./demo/PositionDemo.vue" />

### Expanded

Set `initial.expanded: true` together with `layout.expand: false` to always render the stack fully expanded, instead of collapsed into an overlapping pile.

<component-preview src="./demo/ExpandedDemo.vue" />

### Collapsed

Set `layout.expand: false` to keep the stack collapsed permanently, with no click or hover interaction to expand it.

<component-preview src="./demo/CollapsedDemo.vue" />

### Hover

Set `layout.expand: 'hover'` to expand the stack while the pointer is over it, and collapse it again on mouse leave.

<component-preview src="./demo/HoverDemo.vue" />

### No Drag

Set `draggable: false` on the provider to disable drag-to-dismiss for every toast in the stack.

<component-preview src="./demo/NoDragDemo.vue" />

### Per-Toast Draggable

Pass `draggable` to `add()` to override the provider’s default for a single toast, without affecting the rest of the stack.

<component-preview src="./demo/PerToastDraggableDemo.vue" />

### Drag Direction

Use `drag.direction` to pin the drag-out side (`'left' | 'right' | 'up' | 'down'`) regardless of `position`, or pass a same-axis pair like `['left', 'right']` to allow dragging either way.

<component-preview src="./demo/DragDirectionDemo.vue" />

### Opacity Fade

The toast does not fade on its own. Listen to the `drag` event, derive an opacity from the drag distance, and reset it on `afterDrag`.

<component-preview src="./demo/OpacityFadeDemo.vue" />

### Clear All

Call `clear()` to remove every toast in the stack at once, optionally with a custom transition name.

<component-preview src="./demo/ClearAllDemo.vue" />

### Hide and Show

Call `hide()` to temporarily remove the whole stack from view, and `show()` to restore it exactly as it was — props, timers and all.

<component-preview src="./demo/HideShowDemo.vue" />

### Hide and Show with a Custom Transition

Pass a transition name to `hide()`/`show()` to swap in a different animation just for that call, without changing the toaster’s configured `transition` option.

<component-preview src="./demo/HideShowTransitionDemo.vue" />

### Slot

Pass `slots` to `add()` to render arbitrary content inside the toast component via its default slot.

<component-preview src="./demo/SlotDemo.vue" />

### Slotted Component

Pass a component (instead of plain content) through `slots`, so the toast can render nested, composed markup.

<component-preview src="./demo/NestedSlotDemo.vue" />
