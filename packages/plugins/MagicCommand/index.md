# Magic Command

Magic Command is a flexible collection of components intended to build command palette style menus, such as Spotlight, Raycast and the like.

<component-preview src="./demo/ModalDemo.vue"/>

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

<script>
const { open, close } = useMagicCommand('your-command-id')
</script>
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicCommandPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicCommandPlugin } from '@maas/vue-equipment/plugins'

const app = createApp({})

app.use(MagicCommandPlugin)
```

### Nuxt

The command palette is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicCommand` to the plugins array in your configuration.

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
import { useMagicCommand } from '@maas/vue-equipment/plugins'

const { selectView } = useMagicCommand('your-command-id')

function handleClick() {
  selectView('your-view-id')
}
```

> [!TIP]
> If you have installed the command palette as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

## Peer Dependencies

If you haven’t installed the required peer dependencies automatically, you’ll need to install the following packages manually to use the command palette.

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
