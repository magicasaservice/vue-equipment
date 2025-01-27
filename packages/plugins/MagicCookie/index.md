# Magic Cookie

<component-preview src="./demo/DefaultDemo.vue" />

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template></template>

<script></script>
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

The cookie banner is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicCookie` to the plugins array in your configuration.

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

## API Reference
