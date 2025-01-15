# Magic Drawer

Magic Drawer is a flexible, touch enabled, unstyled drawer component. Useful for things like shopping carts, menus, as a modal replacement on mobile devices and the like.

<ComponentPreview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-drawer id="your-drawer-id">
    <!-- your content -->
  </magic-drawer>
</template>

<script>
const { open } = useMagicDrawer('your-drawer-id')
</script>
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicDrawerPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicDrawerPlugin } from '@maas/vue-equipment/plugins'

const app = createApp({})

app.use(MagicDrawerPlugin)
```

### Nuxt

The drawer is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicDrawer` to the plugins array in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicDrawer'],
  },
})
```

### Direct Import

If you prefer a more granular approach, the drawer can also be directly imported into any Vue component.

```vue
<script setup>
import { MagicDrawer } from '@maas/vue-equipment/plugins'
</script>

<template>
  <magic-drawer id="your-drawer-id">
    <!-- your content -->
  </magic-drawer>
</template>
```

### Composable

In order to interact with the drawer from anywhere within your app, we provide a `useMagicDrawer` composable. Import it directly when needed.

```js
import { onMounted } from 'vue'
import { useMagicDrawer } from '@maas/vue-equipment/plugins'

const { open } = useMagicDrawer('your-drawer-id')

onMounted(() => {
  open()
})
```

> [!TIP]
> If you have installed the drawer as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

## Peer Dependencies

If you haven’t installed the required peer dependencies automatically, you’ll need to install the following packages manually to use the drawer.

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
          label: '[@maas/wheel-gestures](https://www.npmjs.com/package/@maas/wheel-gestures)'
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
    }
  ]"
/>

### Installation

::: code-group

```sh [pnpm]
pnpm install @nuxt/kit @maas/wheel-gestures @vueuse/core @vueuse/integrations defu focus-trap
```

```sh [npm]
npm install @nuxt/kit @maas/wheel-gestures @vueuse/core @vueuse/integrations defu focus-trap
```

```sh [yarn]
yarn add @nuxt/kit @maas/wheel-gestures @vueuse/core @vueuse/integrations defu focus-trap
```

```sh [bun]
bun install @nuxt/kit @maas/wheel-gestures @vueuse/core @vueuse/integrations defu focus-trap
```

:::

## API Reference

### Props

The drawer comes with a simple set of props. Only the id is required.

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
    },
    {
      items: [
        {
          label: 'component',
          description: 'Optionally pass a Vue component instance. Renders in place of the drawer\’s slot.'
        },
        {
          label: 'Component'
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

### Options

To customize the drawer override the necessary settings. Any custom settings will be merged with the default settings.

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
          description: 'Set the drawer\’s position relative to the viewport.'
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
          description: 'Show or hide a backdrop element. Only visible when the drawer is open.'
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
          description: 'Specify the drawer\’s HTML element.'
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
          description: 'Specify the teleport target or disable teleporting the drawer completely.'
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
          description: 'Specify the teleport target or disable teleporting the drawer completely.'
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
          description: 'Set the [transition name](https://vuejs.org/guide/built-ins/transition#named-transitions) for the drawer itself.'
        },
        {
          label: 'string'
        },
        {
          label: '\'magic-drawer--content\''
        }
      ]
    },
    {
      items: [
        {
          label: 'transition.backdrop',
          description: 'Set the [transition name](https://vuejs.org/guide/built-ins/transition#named-transitions) for the drawer\’s backdrop.'
        },
        {
          label: 'string'
        },
        {
          label: '\'magic-drawer--backdrop\''
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
          description: 'Configure the drawer\’s snap animation duration.'
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
          description: 'Configure the drawer\’s snap animation easing.'
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
          label: '—',
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
          label: '—',
        }
      ]
    },
    {
      items: [
        {
          label: 'keyListener',
          description: 'Set to false to disable key listeners completely.'
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
          label: 'keyListener.close',
          description: 'Set keyboard keys to close the drawer.'
        },
        {
          label: 'string[]'
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
          description: 'Disable the drawer completely.'
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

### CSS Variables

In order to provide its basic functionality the drawer comes with some CSS. To ensure that the drawer is customizable, relevant values are available as CSS variables.

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' },
  ]"
  :rows="[
    {
      items: [
        {
          label: '--magic-drawer-height'
        },
        {
          label: '75svh'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-drawer-width'
        },
        {
          label: '100%'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-drawer-justify-content'
        },
        {
          label: 'center'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-drawer-align-items'
        },
        {
          label: 'flex-end'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-drawer-enter-animation'
        },
        {
          label: 'slide-btt-in 300ms ease'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-drawer-enter-animation'
        },
        {
          label: 'slide-btt-out 300ms ease'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-drawer-drag-overshoot'
        },
        {
          label: '4rem'
        },
      ]
    },
  ]"
/>

## Examples

### Vertical

<ComponentPreview src="./demo/VerticalDemo.vue" />

### Horizontal

<ComponentPreview src="./demo/HorizontalDemo.vue" />

### Snap Points

<ComponentPreview src="./demo/SnapPointsDemo.vue" />
