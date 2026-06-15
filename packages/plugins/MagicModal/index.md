# MagicModal

MagicModal is a flexible, unstyled modal component. Useful for things like confirmation dialogs, detail views, and forms.

<ComponentPreview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

MagicModal can be used as a single self-contained component or composed from its individual parts for full control.

### Simple

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

### Composed

```vue
<template>
  <magic-modal-provider id="your-modal-id">
    <magic-modal-trigger as-child>
      <button>Open</button>
    </magic-modal-trigger>
    <magic-modal-teleport>
      <magic-modal-backdrop />
      <magic-modal-content>
        <!-- your content -->
      </magic-modal-content>
    </magic-modal-teleport>
  </magic-modal-provider>
</template>
```

> [!TIP]
> `MagicModalTeleport` is optional. Omit it to keep the modal mounted at all times, with visibility controlled via `v-show`.

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicModalPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicModalPlugin } from '@maas/vue-equipment/plugins/MagicModal'

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

If you prefer a more granular approach, components can be directly imported.

```vue
<script setup>
import {
  MagicModalProvider,
  MagicModalTeleport,
  MagicModalBackdrop,
  MagicModalContent,
  MagicModalTrigger,
} from '@maas/vue-equipment/plugins/MagicModal'
</script>
```

### Composable

In order to interact with the modal from anywhere within your app, we provide a `useMagicModal` composable. Import it directly when needed.

```js
import { onMounted } from 'vue'
import { useMagicModal } from '@maas/vue-equipment/plugins/MagicModal'

const { open } = useMagicModal('your-modal-id')

onMounted(() => {
  open()
})
```

> [!TIP]
> If you have installed the modal as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

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

### MagicModalProvider

The MagicModalProvider wraps the modal and configures all child components according to the provided [options](#options).

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
          label: 'MagicModalOptions'
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

#### Options

To customize the modal, override the necessary options. Any custom options will be merged with the default options.

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
          description: 'Specify the modal\'s HTML element.'
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
          description: 'Default teleport target used by `MagicModalTeleport` unless overridden on the component itself.'
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
          description: 'Set the [transition name](https://vuejs.org/guide/built-ins/transition#named-transitions) for the modal panel.'
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
          description: 'Set the [transition name](https://vuejs.org/guide/built-ins/transition#named-transitions) for the backdrop.'
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
          description: 'Set keyboard keys to close the modal. Set to false to disable the key listener entirely.'
        },
        {
          label: 'string[] | false'
        },
        {
          label: '[\'Escape\']'
        }
      ]
    }
  ]"
/>

### MagicModalTeleport

Teleports all child components to a target in the DOM. Uses `v-if` to mount and unmount its contents when the modal opens and closes — keeping the DOM clean when the modal is inactive. Omit this component if you want the modal to remain mounted at all times.

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

### MagicModalBackdrop

Renders a full-viewport overlay behind the modal panel. Closes the modal when clicked.

#### CSS Variables

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        { label: '--magic-modal-backdrop-position' },
        { label: 'fixed' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-backdrop-top' },
        { label: '0' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-backdrop-left' },
        { label: '0' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-backdrop-right' },
        { label: '0' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-backdrop-bottom' },
        { label: '0' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-backdrop-width' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-backdrop-height' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-backdrop-color' },
        { label: 'rgba(0, 0, 0, 0.5)' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-backdrop-filter' },
        { label: 'unset' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-backdrop-z-index' },
        { label: '998' }
      ]
    }
  ]"
/>

### MagicModalContent

Renders the modal panel with focus trap and scroll lock support.

#### CSS Variables

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' }
  ]"
  :rows="[
    {
      items: [
        { label: '--magic-modal-position' },
        { label: 'fixed' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-inset' },
        { label: '0' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-width' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-height' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-display' },
        { label: 'flex' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-justify-content' },
        { label: 'center' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-align-items' },
        { label: 'center' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-z-index' },
        { label: '999' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-content-max-height' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-content-width' },
        { label: '100%' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-content-display' },
        { label: 'flex' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-content-align-items' },
        { label: 'center' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-content-justify-content' },
        { label: 'center' }
      ]
    },
    {
      items: [
        { label: '--magic-modal-content-overflow-y' },
        { label: 'auto' }
      ]
    }
  ]"
/>

### MagicModalTrigger

Opens or closes the modal on click.

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
          description: 'The modal id. Only required when the trigger is used outside a `MagicModalProvider`.'
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
          description: 'Disable the trigger.'
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
        { plaintext: true, label: 'Whether the modal is currently open.' }
      ]
    },
    {
      items: [
        { label: 'disabled' },
        { label: 'boolean' },
        { plaintext: true, label: 'Whether the trigger is currently disabled.' }
      ]
    }
  ]"
/>

### MagicModal

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
          label: 'MagicModalOptions'
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
        { plaintext: true, label: 'Content rendered inside the modal panel.' }
      ]
    },
    {
      items: [
        { label: 'backdrop' },
        { plaintext: true, label: 'Content rendered inside the backdrop element.' }
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
        { label: 'MagicModalTeleport' },
        { label: 'missing_instance_id' },
        { plaintext: true, label: 'MagicModalTeleport must be nested inside MagicModalProvider' }
      ]
    },
    {
      items: [
        { label: 'MagicModalBackdrop' },
        { label: 'missing_instance_id' },
        { plaintext: true, label: 'MagicModalBackdrop must be nested inside MagicModalProvider' }
      ]
    },
    {
      items: [
        { label: 'MagicModalContent' },
        { label: 'missing_instance_id' },
        { plaintext: true, label: 'MagicModalContent must be nested inside MagicModalProvider' }
      ]
    },
    {
      items: [
        { label: 'MagicModalTrigger' },
        { label: 'missing_instance_id' },
        { plaintext: true, label: 'MagicModalTrigger must be nested inside MagicModalProvider or an id must be provided' }
      ]
    }
  ]"
/>

## Examples

### Default

<ComponentPreview src="./demo/DefaultDemo.vue" />

### Composed

<ComponentPreview src="./demo/ComposedDemo.vue" />
