# MagicCommand

MagicCommand is a flexible collection of components intended to build command palette style menus, such as Spotlight, Raycast and the like.

<component-preview src="./demo/DefaultDemo.vue"/>

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-command-provider id="your-command-id">
    <!-- modal -->
    <magic-command-modal>
      <magic-command-renderer />
    </magic-command-modal>

    <!-- drawer -->
    <magic-command-drawer>
      <magic-command-renderer />
    </magic-command-drawer>

    <!-- initial view -->
    <magic-command-view :initial="true" id="your-view-id">
      <magic-command-trigger>Open Menu</magic-command-trigger>

      <magic-command-content>
        <magic-command-item>
          <!-- your content -->
        </magic-command-item>

        <!-- nested view -->
        <magic-command-item>
          <magic-command-view>
            <magic-command-trigger>Open View</magic-command-trigger>
            <magic-command-content>
              <!-- your content -->
            </magic-command-content>
          </magic-command-view>
        </magic-command-item>
      </magic-command-content>
    </magic-command-view>

    <!-- optional -->
    <magic-command-trigger view-id="your-view-id">
      Open Menu
    </magic-command-trigger>
  </magic-command-provider>
</template>

<script setup>
const { open, close } = useMagicCommand('your-command-id')
</script>
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicCommandPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicCommandPlugin } from '@maas/vue-equipment/plugins/MagicCommand'

const app = createApp({})

app.use(MagicCommandPlugin)
```

### Nuxt

The command palette is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicCommand` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicCommand'],
  },
})
```

### Composable

In order to interact with the command palette from anywhere within your app, we provide a `useMagicCommand` composable. Import it directly when needed.

```js
import { useMagicCommand } from '@maas/vue-equipment/plugins/MagicCommand'

const { selectView } = useMagicCommand('your-command-id')

function handleClick() {
  selectView('your-view-id')
}
```

> [!TIP]
> If you have installed the command palette as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

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

### MagicCommandProvider

The MagicCommandProvider wraps the command palette and configures all child components according to the provided [options](#options).

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

### Options

To customize the command palette, override the necessary options. Any custom options will be merged with the default options.

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
        description: 'Set to true to get verbose error logs.',
      },
      { label: 'boolean' },
      { label: 'false' },
    ],
  },
  {
    items: [
      {
        label: 'transition.content',
        description: 'Override the transition name of the command content.',
      },
      { label: 'string' },
      { label: 'magic-command-content' },
    ],
  },
  {
    items: [
      {
        label: 'keyListener.open',
        description: 'Key combinations that will open the command menu.',
      },
      { label: 'string[] | false' },
      { label: '[\'Cmd+k\', \'Ctrl+k\']' },
    ],
  },
  {
    items: [
      {
        label: 'keyListener.close',
        description: 'Key combinations that will close the command menu.',
      },
      { label: 'string[] | false' },
      { label: '[\'Escape\']' },
    ],
  },
  {
    items: [
      {
        label: 'keyListener.next',
        description: 'Key combinations that will select the next item.',
      },
      { label: 'string[] | false' },
      { label: '[\'ArrowDown\']' },
    ],
  },
  {
    items: [
      {
        label: 'keyListener.prev',
        description: 'Key combinations that will select the previous item.',
      },
      { label: 'string[] | false' },
      { label: '[\'ArrowUp\']' },
    ],
  },
  {
    items: [
      {
        label: 'keyListener.enter',
        description:
          'Key combinations that will trigger `MagicCommandTrigger` when active.',
      },
      { label: 'string[] | false' },
      { label: '[\'Enter\']' },
    ],
  },
  {
    items: [
      {
        label: 'loop',
        description:
          'Whether to loop through items when reaching the end of the list.',
      },
      { label: 'boolean' },
      { label: 'false' },
    ],
  },
]"
/>

### MagicCommandView

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
          description: 'Providing an id is optional. Neccessary for interacting with the view through `useMagicCommand`.'
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
          label: 'initial',
          description: 'When set to `true` this view will be visible when opening the command palette.'
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

### MagicCommandDrawer

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
          label: 'Options',
          description: 'Refer to the MagicDrawer [options table](/plugins/MagicDrawer#options) for details. '
        },
        {
          label: 'MagicCommandDrawerOptions',
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

### MagicCommandModal

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
          label: 'Options',
          description: 'Refer to the MagicModal [options table](/plugins/MagicModal#options) for details. '
        },
        {
          label: 'MagicCommandModalOptions',
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

### MagicCommandRenderer

#### CSS Variables

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' },
  ]"
  :rows="[
    {
      items: [
        {
          label: '--magic-command-renderer-width'
        },
        {
          label: '100%'
        },
      ]
    },
    {
      items: [
        {
          label: '--magic-command-renderer-height'
        },
        {
          label: '100%'
        },
      ]
    }
  ]"
/>

### MagicCommandItem

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
          description: 'Providing an id is optional.'
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
          label: 'disabled',
          description: 'Disable the command item.'
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

#### CSS Variables

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' },
  ]"
  :rows="[
    {
      items: [
        {
          label: '--magic-command-item-cursor'
        },
        {
          label: 'default'
        },
      ]
    }
  ]"
/>

### MagicCommandTrigger

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
          label: 'viewId',
          description: 'Optionally pass the `viewId` of the related view. Can be omitted if the component is nested under `MagicCommandView`.'
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
          label: 'active',
          description: 'Force active state. If the trigger is nested inside `MagicCommandItem`, it will inherit its active state, which in return activates the '
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
          label: 'trigger',
          description: 'Override the interactions that activate the trigger.'
        },
        {
          label: 'Interaction[]',
          description: 'Array<\'click\' | \'mouseenter\'>',
        },
        {
          label: 'false'
        }
      ]
    },
    {
      items: [
        {
          label: 'Action',
          description: 'Choose if the trigger opens or closes the related view.'
        },
        {
          label: 'Action',
          description: '\'open\' | \'close\'',
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
    }
  ]"
/>

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' },
  ]"
  :rows="[
    {
      items: [
        {
          label: '--magic-command-trigger-cursor'
        },
        {
          label: 'pointer'
        },
      ]
    }
  ]"
/>

#### CSS Variables

<ProseTable
  :columns="[
    { label: 'Variable' },
    { label: 'Default' },
  ]"
  :rows="[
    {
      items: [
        {
          label: '--magic-command-trigger-cursor'
        },
        {
          label: 'pointer'
        },
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
        { label: 'MagicCommandDrawer' },
        { label: 'missing_instance_id' },
        { label: 'MagicCommandDrawer must be nested inside MagicCommandProvider' }
      ]
    },
    {
      items: [
        { label: 'MagicCommandTrigger' },
        { label: 'missing_instance_id' },
        { label: 'MagicCommandTrigger must be nested inside MagicCommandProvider' }
      ]
    },
    {
      items: [
        { label: 'MagicCommandTrigger' },
        { label: 'missing_view_id' },
        { label: 'MagicCommandTrigger must be nested inside MagicCommandView or a viewId must be provided' }
      ]
    },
    {
      items: [
        { label: 'MagicCommandView' },
        { label: 'missing_instance_id' },
        { label: 'MagicCommandView must be nested inside MagicCommandProvider' }
      ]
    },
    {
      items: [
        { label: 'MagicCommandContent' },
        { label: 'missing_instance_id' },
        { label: 'MagicCommandContent must be nested inside MagicCommandProvider' }
      ]
    },
    {
      items: [
        { label: 'MagicCommandContent' },
        { label: 'missing_view_id' },
        { label: 'MagicCommandContent must be nested inside MagicCommandView' }
      ]
    },
    {
      items: [
        { label: 'useMagicCommand' },
        { label: 'view_id_required' },
        { label: 'viewId is required to select an item' }
      ]
    },
    {
      items: [
        { label: 'useMagicCommand' },
        { label: 'id_required' },
        { label: 'id is required to select an item' }
      ]
    },
    {
      items: [
        { label: 'useMenuItem' },
        { label: 'view_id_not_found' },
        { label: 'View {viewId} not found' }
      ]
    },
    {
      items: [
        { label: 'useMenuKeyListener' },
        { label: 'menu_not_active' },
        { label: 'MagicMenu {state.id} is not active' }
      ]
    }
  ]"
/>

## Examples

### Modal

<component-preview src="./demo/ModalDemo.vue"/>

### Drawer

<component-preview src="./demo/DrawerDemo.vue"/>
