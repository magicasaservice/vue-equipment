# Magic Menu

Magic Menu is a flexible collection of components intended to build various types of menus and navigation.

[Show Examples](#examples)

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-menu-provider id="your-menu-id">
    <magic-menu-view>
      <magic-menu-trigger>
        <!-- your content -->
      </magic-menu-trigger>
      <magic-menu-content>
        <magic-menu-item>
          <!-- your content -->
        </magic-menu-item>
      </magic-menu-content>
    </magic-menu-view>
  </magic-menu-provider>
</template>

<script>
const { selectView } = useMagicMenu('your-menu-id')
</script>
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicMenuPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicMenuPlugin } from '@maas/vue-equipment/plugins'

const app = createApp({})

app.use(MagicMenuPlugin)
```

### Nuxt

The menu is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicMenu` to the plugins array in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicMenu'],
  },
})
```

### Composable

In order to interact with the menu from anywhere within your app, we provide a `useMagicMenu` composable. Import it directly when needed.

```js
import { useMagicMenu } from '@maas/vue-equipment/plugins'

const { selectView } = useMagicMenu('your-menu-id')

function handleClick() {
  selectView('your-view-id')
}
```

## API Reference

### Props

#### MagicMenuProvider

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

#### MagicMenuView

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
          description: 'Providing an id is optional. Can either be a string or a ref. Neccessary for interacting with the view through `useMagicMenu`.'
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
          label: 'placement',
          description: 'Override the placement of the MenuView.'
        },
       {
          label: 'Placement',
          description: 'Please refer to the [Floating UI docs](https://floating-ui.com/docs/tutorial#placements).'
        },
        {
          label: 'false'
        }
      ]
    },
  ]"
/>

#### MagicMenuContent

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
          label: 'arrow',
          description: 'Show or hide an arrow pointing at the trigger element.'
        },
        {
          label: 'boolean',
        },
        {
          label: 'false'
        }
      ]
    },
    {
      items: [
        {
          label: 'transition',
          description: 'Override the [transition name](https://vuejs.org/guide/built-ins/transition#named-transitions).'
        },
        {
          label: 'string',
        },
        {
          label: 'false'
        }
      ]
    },
    {
      items: [
        {
          label: 'referenceEl',
          description: 'Override the reference element used for positioning the content element.'
        },
        {
          label: 'HTMLElement | ComponentPublicInstance',
          escape: true
        },
        {
          label: 'false'
        }
      ]
    }
  ]"
/>

#### MagicMenuItem

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
          description: 'Disable the menu item.'
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

#### MagicMenuTrigger

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
          label: 'trigger',
        },
        {
          label: 'Interaction[]',
          description: 'Array<\'click\' | \'mouseenter\' | \'right-click\'>',
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

#### MagicMenuChannel

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
          description: 'Providing an id is optional. Can either be a string or a ref. Neccessary for interacting with the channel through `useMagicMenu`.'
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
          label: 'transition',
          description: 'Override the [transition name](https://vuejs.org/guide/built-ins/transition#named-transitions).'
        },
        {
          label: 'string',
        },
        {
          label: 'false'
        }
      ]
    },
  ]"
/>

#### MagicMenuRemote

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
          label: 'channelId',
          description: 'Provide a channel id, for the remote to communicate with.'
        },
        {
          label: 'string'
        },
        {
          label: 'true'
        }
      ]
    },
    {
      items: [
        {
          label: 'viewId',
          description: 'Provide the id of the view, the channel is nested in. This is only neccessary if the triger isn’t nested inside `MagicMenuView`.'
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
          label: 'instanceId',
          description: 'Provide the menu id. This is only neccessary if the trigger isn’t nested inside `MagicMenuProvider`.'
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
          description: 'Disable the remote.'
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
          description: 'Array<\'click\' | \'mouseenter\' | \'right-click\'>'
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

### Options

## Examples

### Menu Bar

<component-preview src="./demo/MenuBarDemo.vue" />

### Navigation Bar

<component-preview src="./demo/NavigationBarDemo.vue" />

### Dropdown Menu

<component-preview src="./demo/DropdownMenuDemo.vue" />

### Context Menu

<component-preview src="./demo/ContextMenuDemo.vue" />
