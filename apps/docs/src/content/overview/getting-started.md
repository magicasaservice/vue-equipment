# Getting Started

Everything you need to know to start using Vue Equipment and its parts.

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Installation

### CLI

Add `@maas/vue-equipment` to your dependencies.

::: code-group

```sh [pnpm]
pnpm install @maas/vue-equipment
```

```sh [npm]
npm install @maas/vue-equipment
```

```sh [yarn]
yarn add @maas/vue-equipment
```

```sh [bun]
bun install @maas/vue-equipment
```

:::

### Vue

If you are using Vue, import and add the plugins to your Vue app.

```js
import { createApp } from 'vue'
import { MagicModalPlugin } from '@maas/vue-equipment/plugins'

const app = createApp({})

app.use(MagicModalPlugin)
```

### Nuxt

Vue Equipment comes with a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and configure it according to your needs.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicDrawer', 'MagicMenu', 'MagicModal'],
    composables: ['useCountdown', 'useScrollTo'],
  },
})
```

## Peer Dependencies

Vue Equipment relies on various peer dependencies. Depending on your package manager as well as your project settings, you may need to add them manually. Please refer to the respective plugin’s documentation to see which dependencies are required.

<ProseTable
:columns="[
  { label: 'Package'},
]"
:rows="[
  {
    items: [
      {
        label: '[@floating-ui/vue](https://www.npmjs.com/package/@floating-ui/vue)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[@maas/magic-timer](https://www.npmjs.com/package/@maas/magic-timer)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[@maas/vue-primitive](https://www.npmjs.com/package/@maas/vue-primitive)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[@maas/wheel-gestures](https://www.npmjs.com/package/@maas/wheel-gestures)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[@nuxt/kit](https://www.npmjs.com/package/@nuxt/kit)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[@vueuse/core](https://www.npmjs.com/package/@vueuse/core)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[@vueuse/integrations](https://www.npmjs.com/package/@vueuse/integrations)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[defu](https://www.npmjs.com/package/defu)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[focus-trap](https://www.npmjs.com/package/focus-trap)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[hls.js](https://www.npmjs.com/package/hls.js)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[luxon](https://www.npmjs.com/package/luxon)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[mitt](https://www.npmjs.com/package/mitt)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[motion](https://www.npmjs.com/package/motion)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[nuxt](https://www.npmjs.com/package/nuxt)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[universal-cookie](https://www.npmjs.com/package/universal-cookie)',
        code: ['label']
      }
    ]
  },
  {
    items: [
      {
        label: '[vue](https://www.npmjs.com/package/vue)',
        code: ['label']
      }
    ]
  }
]"
/>

### Auto Installation

Both npm (starting from version 7) and bun automatically install peer dependencies. For pnpm we recommend adding a `.npmrc` file to the root of your project.

```ini
auto-install-peers=true
```

### Manual Installation

Alternatively, install them all with the following command.

::: code-group

```sh [pnpm]
pnpm install @floating-ui/vue @maas/magic-timer @maas/vue-primitive @maas/wheel-gestures @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap hls.js luxon mitt motion nuxt universal-cookie vue
```

```sh [npm]
npm install @floating-ui/vue @maas/magic-timer @maas/vue-primitive @maas/wheel-gestures @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap hls.js luxon mitt motion nuxt universal-cookie vue
```

```sh [yarn]
yarn add @floating-ui/vue @maas/magic-timer @maas/vue-primitive @maas/wheel-gestures @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap hls.js luxon mitt motion nuxt universal-cookie vue
```

```sh [bun]
bun install @floating-ui/vue @maas/magic-timer @maas/vue-primitive @maas/wheel-gestures @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap hls.js luxon mitt motion nuxt universal-cookie vue
```

:::
