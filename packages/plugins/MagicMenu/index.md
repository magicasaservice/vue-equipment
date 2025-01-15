# Magic Menu

Magic Menu is a flexible collection of components intended to build various types of menus and navigation.

## Examples

### Menu Bar

<component-preview src="./demo/MenuBarDemo.vue" />

### Dropdown Menu

<component-preview src="./demo/DropdownMenuDemo.vue" />

### Context Menu

<component-preview src="./demo/ContextMenuDemo.vue" />

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
