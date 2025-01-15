# Magic Menu

Magic Menu is a flexible collection of components intended to build various types of menus and navigation.

[Show Examples](#mode)

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

The provider wraps the menu and configures all child components according to the provided [options](#options).

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
          description: 'Override the interactions that activate the trigger.'
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
          description: 'Override the interactions that activate the remote.'
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
          label: 'mode',
          description: 'The menu includes four different modes which preconfigure its appeareance and behavior. Details [below](#mode)'
        },
        { label: 'MenuMode',
          description: 'menubar | navigation |dropdown | context'
        },
        { label: 'menubar' }
      ]
    },
    {
      items: [
        { 
          label: 'debug',
          description: 'Set to true, to get visual feedback on positioning.'
        },
        { label: 'boolean' },
        { label: 'false' }
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
        { label: 'transition.content.default' },
        { label: 'string' },
        { label: '-' }
      ]
    },
    {
      items: [
        { label: 'transition.content.nested' },
        { label: 'string' },
        { label: 'magic-menu-content--fade' }
      ]
    },
    {
      items: [
        { label: 'transition.channel' },
        { label: 'string' },
        { label: 'magic-menu-channel' }
      ]
    },
    {
      items: [
        { label: 'floating.strategy' },
        { label: 'fixed | absolute' },
        { label: '-' }
      ]
    },
    {
      items: [
        { label: 'delay.mouseenter' },
        { label: 'number' },
        { label: '-' }
      ]
    },
    {
      items: [
        { label: 'delay.mouseleave' },
        { label: 'number' },
        { label: '-' }
      ]
    },
    {
      items: [
        { label: 'delay.click' },
        { label: 'number' },
        { label: '-' }
      ]
    },
    {
      items: [
        { label: 'delay.rightClick' },
        { label: 'number' },
        { label: '-' }
      ]
    }
  ]"
/>

## Mode

The menu includes four different modes which preconfigure its appeareance and behavior. You can set the mode via the `options.mode` prop on the `MagicMenuProvider`.

### Menu Bar

A menu common in desktop applications which provides top-level as well as nested commands.

<component-preview src="./demo/MenuBarDemo.vue" />

### Navigation Bar

A collection of links for navigating websites.

<component-preview src="./demo/NavigationBarDemo.vue" />

### Dropdown Menu

A single top level menu which provides top-level as well as nested commands, triggered by a click, anchored at a reference element.

<component-preview src="./demo/DropdownMenuDemo.vue" />

### Context Menu

A single top level menu which provides top-level as well as nested commands, triggered by a right click, anchored at the click’s coordinates.

<component-preview src="./demo/ContextMenuDemo.vue" />
