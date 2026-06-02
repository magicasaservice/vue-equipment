# MagicDrawer

MagicDrawer is a flexible, touch enabled, unstyled drawer component. Useful for things like shopping carts, menus, as a modal replacement on mobile devices and the like.

<ComponentPreview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

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
  <magic-drawer-provider id="your-drawer-id" :options="{}">
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

> [!TIP]
> `MagicDrawerTeleport` is optional. Omit it to keep the drawer mounted at all times, with visibility controlled via `v-show`.

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

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

> [!TIP]
> If you have installed the drawer as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

## Peer Dependencies

If you haven't installed the required peer dependencies automatically, you'll need to install the following packages manually.

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
          label: '[@vueuse/integrations](https://www.npmjs.com/package/@vueuse/integrations)'
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
          label: '[focus-trap](https://www.npmjs.com/package/focus-trap)'
        }
      ]
    },
    {
      items: [
        {
          label: '[wheel-gestures](https://www.npmjs.com/package/wheel-gestures)'
        }
      ]
    },
  ]"
/>

### Installation

::: code-group

```sh [pnpm]
pnpm install @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap wheel-gestures
```

```sh [npm]
npm install @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap wheel-gestures
```

```sh [yarn]
yarn add @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap wheel-gestures
```

```sh [bun]
bun install @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap wheel-gestures
```

:::

## API Reference

### MagicDrawerProvider

The MagicDrawerProvider wraps the drawer and configures all child components according to the provided [options](#options).

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
          label: 'MagicDrawerOptions'
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

#### Options

To customize the drawer override the necessary options. Any custom options will be merged with the default options.

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
          label: 'position',
          description: 'Set the drawer\'s position relative to the viewport.'
        },
        {
          label: 'string',
          description: '\'top\' | \'right\' | \'bottom\' | \'left\''
        },
        {
          label: '\'bottom\''
        }
      ]
    },
    {
      items: [
        {
          label: 'backdrop',
          description: 'Show or hide a backdrop element in the simple `MagicDrawer` component. Has no effect when composing manually.'
        },
        {
          label: 'boolean'
        },
        {
          label: 'true'
        }
      ]
    },
    {
      items: [
        {
          label: 'tag',
          description: 'Specify the drawer\'s HTML element.'
        },
        {
          label: 'string',
          description: '\'dialog\' | \'div\''
        },
        {
          label: '\'dialog\''
        }
      ]
    },
    {
      items: [
        {
          label: 'focusTrap',
          description: 'Pass focus-trap options or disable completely. A complete list of options can be found [here](https://www.npmjs.com/package/focus-trap#createoptions). Make sure to disable this, if you do not have a focusable element in your drawer.'
        },
        {
          label: 'boolean | FocusTrapOptions'
        },
        {
          label: 'object'
        }
      ]
    },
    {
      items: [
        {
          label: 'scrollLock',
          description: 'Lock body scroll when the drawer is open.'
        },
        {
          label: 'boolean | object'
        },
        {
          label: 'object'
        }
      ]
    },
    {
      items: [
        {
          label: 'scrollLock.padding',
          description: 'Locking the body scroll hides any permanently visible scrollbar. Adding a padding to fixed elements prevents them from shifting in this case.'
        },
        {
          label: 'boolean'
        },
        {
          label: 'true'
        }
      ]
    },
    {
      items: [
        {
          label: 'snapPoints',
          description: 'Add snap points. Points can either be a decimal between 0 and 1 or an integer with px appended, like \'768px\'.'
        },
        {
          label: 'DrawerSnapPoint[]',
          description: 'Array<number + \'px\' | number>'
        },
        {
          label: '[1]'
        }
      ]
    },
    {
      items: [
        {
          label: 'teleport.target',
          description: 'Default teleport target used by `MagicDrawerTeleport` unless overridden on the component itself.'
        },
        {
          label: 'string'
        },
        {
          label: '\'body\''
        }
      ]
    },
    {
      items: [
        {
          label: 'teleport.disabled',
          description: 'Disable teleporting entirely when using the default target.'
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
          label: 'transition.content',
          description: 'Set the [transition name](https://vuejs.org/guide/built-ins/transition#named-transitions) for the drawer panel.'
        },
        {
          label: 'string'
        },
        {
          label: '\'magic-drawer-content\''
        }
      ]
    },
    {
      items: [
        {
          label: 'transition.backdrop',
          description: 'Set the [transition name](https://vuejs.org/guide/built-ins/transition#named-transitions) for the backdrop.'
        },
        {
          label: 'string'
        },
        {
          label: '\'magic-drawer-backdrop\''
        }
      ]
    },
    {
      items: [
        {
          label: 'threshold.lock',
          description: 'Configure the dragged distance before the drawer prevents other touch interactions.'
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
          description: 'Configure the dragged distance before the drawer snaps.'
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
          description: 'Configure the momentum from when the drawer snaps.'
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
          description: 'Configure the drawer\'s snap animation duration.'
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
          description: 'Configure the drawer\'s snap animation easing.'
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
          label: 'initial.open',
          description: 'Open the drawer as soon as the component is mounted.'
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
          label: 'initial.transition',
          description: 'Animate the drawer when it opens initially. Ignored if <code>initial.open</code> is not set.'
        },
        {
          label: 'boolean'
        },
        {
          label: '—'
        }
      ]
    },
    {
      items: [
        {
          label: 'initial.snapPoint',
          description: 'Optionally provide an initial snap point for the drawer to snap to. Ignored if snap points are not specified.'
        },
        {
          label: 'DrawerSnapPoint',
          description: 'number + \'px\' | number'
        },
        {
          label: '—'
        }
      ]
    },
    {
      items: [
        {
          label: 'keyListener.close',
          description: 'Set keyboard keys to close the drawer. Set to false to disable the key listener entirely.'
        },
        {
          label: 'string[] | false'
        },
        {
          label: '[\'Escape\']'
        }
      ]
    },
    {
      items: [
        {
          label: 'enableMousewheel',
          description: 'When set to true, the drawer will react to mousewheel input.'
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
          label: 'preventZoom',
          description: 'Prevent viewport scaling when the drawer is open.'
        },
        {
          label: 'boolean'
        },
        {
          label: 'true'
        }
      ]
    },
    {
      items: [
        {
          label: 'preventDragClose',
          description: 'Prevent the drawer from being closed by dragging.'
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
          description: 'Disable all drawer interactions.'
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

### MagicDrawerTeleport

Teleports all child components to a target in the DOM. Uses `v-if` to mount and unmount its contents when the drawer opens and closes — keeping the DOM clean when the drawer is inactive. Omit this component if you want the drawer to remain mounted at all times.

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
          label: 'to',
          description: 'Override the teleport target set in the provider options.'
        },
        {
          label: 'string | RendererElement'
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
          description: 'Disable teleporting, rendering children in place instead.'
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

### MagicDrawerBackdrop

Renders a full-viewport overlay behind the drawer panel. Closes the drawer when clicked.

#### CSS Variables

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        { label: '--magic-drawer-backdrop-position' },
        { label: 'fixed' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-backdrop-top' },
        { label: '0' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-backdrop-left' },
        { label: '0' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-backdrop-right' },
        { label: '0' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-backdrop-bottom' },
        { label: '0' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-backdrop-width' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-backdrop-height' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-backdrop-color' },
        { label: 'rgba(0, 0, 0, 0.5)' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-backdrop-filter' },
        { label: 'unset' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-backdrop-z-index' },
        { label: '998' }
      ]
    }
  ]"
/>

### MagicDrawerContent

Renders the drawer panel with drag, snap, and scroll behavior.

#### CSS Variables

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        { label: '--magic-drawer-position' },
        { label: 'fixed' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-inset' },
        { label: '0' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-display' },
        { label: 'flex' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-z-index' },
        { label: '999' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-height' },
        { label: '75svh' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-width' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-max-height' },
        { label: 'none' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-max-width' },
        { label: 'none' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-content-width' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-content-height' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-content-max-height' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-justify-content' },
        { label: 'center' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-align-items' },
        { label: 'flex-end' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-enter-animation' },
        { label: 'slide-btt-in 300ms ease' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-leave-animation' },
        { label: 'slide-btt-out 300ms ease' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-drag-overshoot' },
        { label: '4rem' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-cursor' },
        { label: 'grab' }
      ]
    },
    {
      items: [
        { label: '--magic-drawer-cursor-dragging' },
        { label: 'grabbing' }
      ]
    }
  ]"
/>

### MagicDrawerTrigger

Opens or closes the drawer on click.

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
          description: 'The drawer id. Only required when the trigger is used outside a `MagicDrawerProvider`.'
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
          label: 'disabled',
          description: 'Disable the trigger. Defaults to the disabled state set on `MagicDrawerProvider` if not provided.'
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
          description: 'Prevent the component from rendering its own element and pass all functionality to the child element instead.'
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

#### Slot Props

<ProseTable
  :columns="[
    { label: 'Prop' },
    { label: 'Type' },
    { label: 'Description' }
  ]"
  :rows="[
    {
      items: [
        { label: 'active' },
        { label: 'boolean' },
        { label: 'Whether the drawer is currently open.' }
      ]
    },
    {
      items: [
        { label: 'disabled' },
        { label: 'boolean' },
        { label: 'Whether the trigger is currently disabled.' }
      ]
    }
  ]"
/>

### MagicDrawer

A self-contained component that composes all primitives internally. Use this for simple cases where you don’t need to customise the markup.

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
          label: 'MagicDrawerOptions'
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

#### Slots

<ProseTable
  :columns="[
    { label: 'Slot' },
    { label: 'Description' }
  ]"
  :rows="[
    {
      items: [
        { label: 'default' },
        { label: 'Content rendered inside the drawer panel.' }
      ]
    },
    {
      items: [
        { label: 'backdrop' },
        { label: 'Content rendered inside the backdrop element. Also causes the backdrop to render when `options.backdrop` is false.' }
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
        { label: 'MagicDrawerTeleport' },
        { label: 'missing_instance_id' },
        { label: 'MagicDrawerTeleport must be nested inside MagicDrawerProvider' }
      ]
    },
    {
      items: [
        { label: 'MagicDrawerBackdrop' },
        { label: 'missing_instance_id' },
        { label: 'MagicDrawerBackdrop must be nested inside MagicDrawerProvider' }
      ]
    },
    {
      items: [
        { label: 'MagicDrawerContent' },
        { label: 'missing_instance_id' },
        { label: 'MagicDrawerContent must be nested inside MagicDrawerProvider' }
      ]
    },
    {
      items: [
        { label: 'MagicDrawerTrigger' },
        { label: 'missing_instance_id' },
        { label: 'MagicDrawerTrigger must be nested inside MagicDrawerProvider or an id must be provided' }
      ]
    },
    {
      items: [
        { label: 'MagicDrawerContent' },
        { label: 'overshoot_unit' },
        { label: '--magic-drawer-drag-overshoot needs to be specified in px or rem' }
      ]
    }
  ]"
/>

## Caveats

The drawer handles situations where dragging and scrolling might interfere with each other on touch devices. In order for the drawer to differentiate when the user scrolls and when the user drags, any scrollable containers within the drawer need to have their overflow value explicitly set to `auto` or `scroll`.

## Examples

### Vertical

<ComponentPreview src="./demo/VerticalDemo.vue" />

### Horizontal

<ComponentPreview src="./demo/HorizontalDemo.vue" />

### Snap Points

<ComponentPreview src="./demo/SnapPointsDemo.vue" />

### Mousewheel

<ComponentPreview src="./demo/MousewheelDemo.vue" />

### Composed

<ComponentPreview src="./demo/ComposedDemo.vue" />
