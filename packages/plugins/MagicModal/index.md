# MagicModal

MagicModal is a flexible, unstyled modal component. Useful for things like confirmation dialogs, detail views, and forms.

<ComponentPreview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-modal id="your-modal-id">
    <!-- your content -->
  </magic-modal>
</template>

<script setup>
const { open } = useMagicModal('your-modal-id')
</script>
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicModalPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicModalPlugin } from '@maas/vue-equipment/plugins'

const app = createApp({})

app.use(MagicModalPlugin)
```

### Nuxt

The modal is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicModal` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicModal'],
  },
})
```

### Direct Import

If you prefer a more granular approach, the modal can also be directly imported into any Vue component.

```vue
<script setup>
import { MagicModal } from '@maas/vue-equipment/plugins'
</script>

<template>
  <magic-modal id="your-modal-id">
    <!-- your content -->
  </magic-modal>
</template>
```

### Composable

In order to interact with the modal from anywhere within your app, we provide a `useMagicModal` composable. Import it directly when needed.

```js
import { onMounted } from 'vue'
import { useMagicModal } from '@maas/vue-equipment/plugins'

const { open } = useMagicModal('your-modal-id')

onMounted(() => {
  open()
})
```

> [!TIP]
> If you have installed the modal as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

## Peer Dependencies

If you haven’t installed the required peer dependencies automatically, you’ll need to install the following packages manually to use the modal.

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
    }
  ]"
/>

### Installation

::: code-group

```sh [pnpm]
pnpm install @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap
```

```sh [npm]
npm install @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap
```

```sh [yarn]
yarn add @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap
```

```sh [bun]
bun install @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap
```

:::

## API Reference

### Props

The modal comes with a simple set of props. Only the id is required.

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
          label: 'MagicModalOptions'
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

### Options

To customize the modal override the necessary options. Any custom options will be merged with the default options.

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
          label: 'backdrop',
          description: 'Show or hide a backdrop element. Only visible when the modal is open.'
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
          description: 'Specify the modal’s HTML element.'
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
          description: 'Pass focus-trap options or disable completely. A complete list of options can be found [here](https://www.npmjs.com/package/focus-trap#createoptions). Make sure to disable this, if you do not have a focusable element in your modal.'
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
          description: 'Lock body scroll when the modal is open.'
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
          label: 'teleport.target',
          description: 'Specify the teleport target or disable teleporting the modal completely.'
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
          description: 'Specify the teleport target or disable teleporting the modal completely.'
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
          description: 'Set the transition name for the modal itself.'
        },
        {
          label: 'string'
        },
        {
          label: '\'magic-modal-content\''
        }
      ]
    },
    {
      items: [
        {
          label: 'transition.backdrop',
          description: 'Set the transition name for the modal’s backdrop.'
        },
        {
          label: 'string'
        },
        {
          label: '\'magic-modal-backdrop\''
        }
      ]
    },
    {
      items: [
        {
          label: 'keyListener.close',
          description: 'Set keyboard keys to close the modal.'
        },
        {
          label: 'string[]'
        },
        {
          label: '[\'Escape\']'
        }
      ]
    }
  ]"
/>

### CSS Variables

In order to provide its basic functionality the modal comes with some CSS. To ensure that the modal is customizable, relevant values are available as CSS variables.

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' },
  ]"
  :rows="[
    {
      items: [
        {
          label: '--magic-modal-z-index'
        },
        {
          label: '999'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-modal-content-align-items'
        },
        {
          label: 'center'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-modal-content-justify-content'
        },
        {
          label: 'center'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-modal-content-overflow-y'
        },
        {
          label: 'auto'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-modal-backdrop-color'
        },
        {
          label: 'rgba(0, 0, 0, 0.5)'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-modal-backdrop-filter'
        },
        {
          label: 'unset'
        },
      ]
    }
  ]"
/>
