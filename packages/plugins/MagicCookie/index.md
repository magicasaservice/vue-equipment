# MagicCookie

MagicCookie is a flexible collection of components intended to build cookie banners.

<component-preview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-cookie-provider id="your-cookie-id">
    <magic-cookie-view>
      <magic-cookie-item v-slot="{ item }">
        <!-- your content -->
      </magic-cookie-item>
    </magic-cookie-view>
    <!-- your content -->
  </magic-cookie-provider>
</template>

<script setup>
const { acceptAll } = useMagicCookie('your-cookie-id')
</script>
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicCookiePlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicCookiePlugin } from '@maas/vue-equipment/plugins'

const app = createApp({})

app.use(MagicCookiePlugin)
```

### Nuxt

The cookie banner is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicCookie` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicCookie'],
  },
})
```

### Composable

In order to interact with the cookie banner from anywhere within your app, we provide a `useMagicCookie` composable. Import it directly when needed.

```js
import { useMagicCookie } from '@maas/vue-equipment/plugins'

const { acceptAll } = useMagicCookie('your-cookie-id')

function handleClick() {
  acceptAll()
}
```

> [!TIP]
> If you have installed the component as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

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
          label: '[@maas/vue-autosize](https://www.npmjs.com/package/@maas/vue-autosize)'
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
          label: '[universal-cookie](https://www.npmjs.com/package/universal-cookie)'
        }
      ]
    }
  ]"
/>

### Installation

::: code-group

```sh [pnpm]
pnpm install @nuxt/kit @maas/vue-autosize @vueuse/core @vueuse/integrations defu universal-cookie
```

```sh [npm]
npm install @nuxt/kit @maas/vue-autosize @vueuse/core @vueuse/integrations defu universal-cookie
```

```sh [yarn]
yarn add @nuxt/kit @maas/vue-autosize @vueuse/core @vueuse/integrations defu universal-cookie
```

```sh [bun]
bun install @nuxt/kit @maas/vue-autosize @vueuse/core @vueuse/integrations defu universal-cookie
```

:::

## API Reference

### MagicCookieProvider

The provider wraps the cookie banner and configures all child components according to the provided [options](#options).

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
          label: 'MagicCookieOptions'
        },
        {
          label: 'false'
        }
      ]
    },
  ]"
/>

#### Options

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
          label: 'maxAge',
          description: 'Maximum age of the cookie in seconds.'
        },
        { label: 'number' },
        { label: '86400' }
      ]
    },
    {
      items: [
        {
          label: 'transition',
          description: 'Configure the transition name of the cookie view.'
        },
        { label: 'string' },
        { label: 'magic-cookie-view' }
      ]
    },
    {
      items: [
        {
          label: 'animation.duration',
          description: 'Configure the cookie banner’s animation duration.'
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
          label: 'animation.easing',
          description: 'Configure the cookie banner’s animation easing.'
        },
        {
          label: 'function',
          description: '(t: number) => number'
        },
        {
          label: 'easeOutQuad',
          descriptipn: 't * (2 - t)'
        }
      ]
    },
  ]"
/>

### MagicCookieItem

The item registers and set the cookie with the given props.

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
          label: 'maxAge',
          description: 'Override the maximum age of the cookie in seconds.'
        },
        {
          label: 'number'
        },
        {
          label: '–'
        }
      ]
    },
  ]"
/>
