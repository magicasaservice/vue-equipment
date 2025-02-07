# MagicDraggable

MagicDraggable is a touch enabled, draggable component that can snap to configurable points inside its container.

<component-preview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-draggable id="your-draggable-id">
    <!-- your content -->
  </magic-draggable>
</template>

<script setup>
const { open } = useMagicDraggable('your-draggable-id')
</script>
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicDraggablePlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicDraggablePlugin } from '@maas/vue-equipment/plugins'

const app = createApp({})

app.use(MagicDraggablePlugin)
```

### Nuxt

The component is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicDraggable` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicDraggable'],
  },
})
```

### Direct Import

If you prefer a more granular approach, the component can also be directly imported into any Vue component.

```vue
<script setup>
import { MagicDraggable } from '@maas/vue-equipment/plugins'
</script>

<template>
  <magic-draggable id="your-draggable-id">
    <!-- your content -->
  </magic-draggable>
</template>
```

### Composable

In order to interact with the component from anywhere within your app, we provide a `useMagicDraggable` composable. Import it directly when needed.

```js
import { useMagicDraggable } from '@maas/vue-equipment/plugins'

const { snapTo } = useMagicDraggable('your-draggable-id')

function handleClick() {
  snapTo('top-right')
}
```

> [!TIP]
> If you have installed the component as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

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

### Props

The component comes with a simple set of props. Only the id is required.

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
          label: 'MagicDraggableOptions'
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

### Options

To customize the component override the necessary options. Any custom options will be merged with the default options.

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
          label: 'tag',
          description: 'Specify the drawer\'s HTML element.'
        },
        {
          label: 'string',
          description: '\'dialog\' | \'div\''
        },
        {
          label: '\'div\''
        }
      ]
    },
    {
      items: [
        {
          label: 'threshold.distance',
          description: 'Configure the dragged distance before the component snaps.'
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
          description: 'Configure the momentum from when the component snaps.'
        },
        {
          label: 'number'
        },
        {
          label: '1.5'
        }
      ]
    },
    {
      items: [
        {
          label: 'threshold.idle',
          description: 'Configure the idle time threshold in milliseconds before drag is considered complete.'
        },
        {
          label: 'number'
        },
        {
          label: '250'
        }
      ]
    },
    {
      items: [
        {
          label: 'threshold.lock',
          description: 'Configure the dragged distance before the component prevents other touch interactions.'
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
          label: 'animation.snap.duration',
          description: 'Configure the component’s snap animation duration.'
        },
        {
          label: 'number'
        },
        {
          label: '500'
        }
      ]
    },
    {
      items: [
        {
          label: 'animation.snap.easing',
          description: 'Configure the component’s snap animation easing.'
        },
        {
          label: 'function',
          description: '(t: number) => number'
        },
        {
          label: 'easeOutBack',
          description: '1 + (t - 1) * (t - 1) * ((o + 1) * (t - 1) + o)'
        }
      ]
    },
    {
      items: [
        {
          label: 'initial.snapPoint',
          description: 'Provide an initial snap point for the component to snap to.'
        },
        {
          label: 'DraggableSnapPoint',
          description: 'Position | [Position, { x?: number, y?: number }]'
        },
        {
          label: '\'center\''
        }
      ]
    },
    {
      items: [
        {
          label: 'snapPoints',
          description: 'Add snap points. Points can be either a position string (\'top-left\', \'center\', etc.) or a tuple with position and offset coordinates.'
        },
        {
          label: 'DraggableSnapPoint[]',
          description: 'Array<Position | [Position, { x?: number, y?: number }]>'
        },
        {
          label: 'DraggableSnapPoint[]',
          description: '[\'top-left\', \'top-right\', \'bottom-left\', \'bottom-right\']'
        }
      ]
    },
    {
      items: [
        {
          label: 'scrollLock',
          description: 'Lock body scroll when the menu is open.'
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
          label: 'disabled',
          description: 'Disable the component completely.'
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

In order to provide its basic functionality the component comes with some CSS. To ensure that the component is customizable, relevant values are available as CSS variables.

<ProseTable
 :columns="[
   { label: 'Variable' },
   { label: 'Default' },
 ]"
 :rows="[
   {
     items: [
       {
         label: '--magic-draggable-position'
       },
       {
         label: 'fixed'
       },
     ]
   },
   {
     items: [
       {
         label: '--magic-draggable-width'
       },
       {
         label: '100%'
       },
     ]
   },
   {
     items: [
       {
         label: '--magic-draggable-height'
       },
       {
         label: '100%'
       },
     ]
   },
   {
     items: [
       {
         label: '--magic-draggable-z-index'
       },
       {
         label: '999'
       },
     ]
   },
   {
     items: [
       {
         label: '--magic-draggable-inset'
       },
       {
         label: '0'
       },
     ]
   }
 ]"
/>
