# Magic Drawer

Magic Drawer is a highly flexible, touch enabled, unstyled drawer component. Useful for things like shopping carts, menus, as a modal replacement on mobile devices and the like.

<component-preview src="./demo/DefaultDemo.vue" />

#### Overview

[[toc]]

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

To make the drawer accessible across your entire Vue application, import and add the `MagicDrawerPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicDrawerPlugin } from '@maas/vue-equipment/vue'

const app = createApp({})

app.use(MagicDrawerPlugin)
```

### Nuxt

The drawer is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment` to your modules and add the `MagicDrawer` to the `plugins` list in your configuration.

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
import { MagicDrawer } from '@maas/vue-equipment/vue'
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
import { useMagicDrawer } from '@maas/vue-equipment'

const { open } = useMagicDrawer('your-drawer-id')

onMounted(() => {
  open()
})
```

> [!TIP]
> If you have installed the drawer as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

## Anatomy

```vue
<template>
  <magic-drawer id="your-drawer-id">
    <!-- your content -->
  </magic-drawer>
</template>

<script>
import { MagicDrawer, useMagicDrawer } from '@maas/vue-equipment'

const { open } = useMagicDrawer('your-drawer-id')
</script>
```

## API Reference

### Props

The drawer comes with a simple set of props. Only the id is required.

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
          description: 'Providing an id is required. Can either be a string or a ref.',
          code: ['label']
        },
        {
          label: 'MaybeRef\<string\>',
          code: ['label'],
          escape: true
        },
        {
          label: 'true',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'options',
          description: 'Refer to the options table below for details.',
          code: ['label']
        },
        {
          label: 'MagicDrawerOptions',
          code: ['label']
        },
        {
          label: 'false',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'component',
          description: 'Optionally pass a Vue component instance. Renders in place of the drawer\’s slot.',
          code: ['label']
        },
        {
          label: 'Component',
          code: ['label']
        },
        {
          label: 'false',
          code: ['label']
        }
      ]
    }
  ]"
/>

### Options

To customize the drawer override the necessary settings. Any custom settings will be merged with the default settings.

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
          label: 'position',
          description: 'Set the drawer\’s position relative to the viewport.',
          code: ['label']
        },
        {
          label: 'string',
          description: '\'top\' | \'right\' | \'bottom\' | \'left\'',
          code: ['label']
        },
        {
          label: '\'bottom\'',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'backdrop',
          description: 'Show or hide a backdrop element. Only visible when the drawer is open.',
          code: ['label']
        },
        {
          label: 'boolean',
          code: ['label']
        },
        {
          label: 'true',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'tag',
          description: 'Specify the drawer\’s HTML element.',
          code: ['label']
        },
        {
          label: 'string',
          description: '\'dialog\' | \'div\'',
          code: ['label']
        },
        {
          label: '\'dialog\'',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'focusTrap',
          description: 'Pass focus-trap options or disable completely. A complete list of options can be found [here](https://www.npmjs.com/package/focus-trap#createoptions). Make sure to disable this, if you do not have a focusable element in your drawer.',
          code: ['label']
        },
        {
          label: 'boolean | FocusTrapOptions',
          code: ['label']
        },
        {
          label: 'object',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'scrollLock',
          description: 'Lock body scroll when the drawer is open.',
          code: ['label']
        },
        {
          label: 'boolean | object',
          code: ['label']
        },
        {
          label: 'object',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'scrollLock.padding',
          description: 'Locking the body scroll hides any permanently visible scrollbar. Adding a padding to fixed elements prevents them from shifting in this case.',
          code: ['label']
        },
        {
          label: 'boolean',
          code: ['label']
        },
        {
          label: 'true',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'snapPoints',
          description: 'Add snap points. Points can either be a decimal between 0 and 1 or an integer with px appended, like \'768px\'.',
          code: ['label']
        },
        {
          label: 'DrawerSnapPoint[]',
          description: 'Array<`${string}px` | number>',
          code: ['label', 'description']
        },
        {
          label: '[1]',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'teleport.target',
          description: 'Specify the teleport target or disable teleporting the drawer completely.',
          code: ['label']
        },
        {
          label: 'string',
          code: ['label']
        },
        {
          label: '\'body\'',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'teleport.disabled',
          description: 'Specify the teleport target or disable teleporting the drawer completely.',
          code: ['label']
        },
        {
          label: 'boolean',
          code: ['label']
        },
        {
          label: 'false',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'transition.content',
          description: 'Set CSS transition classes for the drawer itself.',
          code: ['label']
        },
        {
          label: 'string',
          code: ['label']
        },
        {
          label: '\'magic-drawer--content\'',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'transition.backdrop',
          description: 'Set CSS transition classes for the drawer\’s backdrop.',
          code: ['label']
        },
        {
          label: 'string',
          code: ['label']
        },
        {
          label: '\'magic-drawer--backdrop\'',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'threshold.lock',
          description: 'Configure the dragged distance before the drawer prevents other touch interactions.',
          code: ['label']
        },
        {
          label: 'number',
          code: ['label']
        },
        {
          label: '0',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'threshold.distance',
          description: 'Configure the dragged distance before the drawer snaps.',
          code: ['label']
        },
        {
          label: 'number',
          code: ['label']
        },
        {
          label: '128',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'threshold.momentum',
          description: 'Configure the momentum from when the drawer snaps.',
          code: ['label']
        },
        {
          label: 'number',
          code: ['label']
        },
        {
          label: '1',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'animation.snap.duration',
          description: 'Configure the drawer\’s snap animation duration.',
          code: ['label']
        },
        {
          label: 'number',
          code: ['label']
        },
        {
          label: '300',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'animation.snap.easing',
          description: 'Configure the drawer\’s snap animation easing.',
          code: ['label']
        },
        {
          label: 'function',
          code: ['label']
        },
        {
          label: 'function',
          description: '(t) => t * (2 - t)',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'initial.open',
          description: 'Open the drawer as soon as the component is mounted.',
          code: ['label']
        },
        {
          label: 'boolean',
          code: ['label']
        },
        {
          label: 'false',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'initial.transition',
          description: 'Animate the drawer when it opens initially. Ignored if <code>initial.open</code> is not set.',
          code: ['label']
        },
        {
          label: 'boolean',
          code: ['label']
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
          description: 'Optionally provide an initial snap point for the drawer to snap to. Ignored if <code>initial.open</code> is not set.',
          code: ['label']
        },
        {
          label: 'DrawerSnapPoint',
          code: ['label']
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
          description: 'Set to false to disable key listeners completely.',
          code: ['label']
        },
        {
          label: 'boolean | object',
          code: ['label']
        },
        {
          label: 'object',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'keyListener.close',
          description: 'Set keyboard keys to close the drawer.',
          code: ['label']
        },
        {
          label: 'string[]',
          code: ['label']
        },
        {
          label: '[\'Escape\']',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'enableMousewheel',
          description: 'When set to true, the drawer will react to mousewheel input.',
          code: ['label']
        },
        {
          label: 'boolean',
          code: ['label']
        },
        {
          label: 'false',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'preventZoom',
          description: 'Prevent the browser from being zoomed when the drawer is open.',
          code: ['label']
        },
        {
          label: 'boolean',
          code: ['label']
        },
        {
          label: 'true',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'preventDragClose',
          description: 'Prevent the drawer from being closed by dragging.',
          code: ['label']
        },
        {
          label: 'boolean',
          code: ['label']
        },
        {
          label: 'false',
          code: ['label']
        }
      ]
    },
    {
      items: [
        {
          label: 'disabled',
          description: 'Disable the drawer completely.',
          code: ['label']
        },
        {
          label: 'boolean',
          code: ['label']
        },
        {
          label: 'false',
          code: ['label']
        }
      ]
    }
  ]"
/>
