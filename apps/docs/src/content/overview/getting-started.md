# Getting Started

Everything you need to know to start using Vue Equipment.

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

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
        label: '[@floating-ui/vue](https://www.npmjs.com/package/@floating-ui/vue)'
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
        label: '[@maas/magic-timer](https://www.npmjs.com/package/@maas/magic-timer)'
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
  },
  {
    items: [
      {
        label: '[hls.js](https://www.npmjs.com/package/hls.js)'
      }
    ]
  },
  {
    items: [
      {
        label: '[luxon](https://www.npmjs.com/package/luxon)'
      }
    ]
  },
  {
    items: [
      {
        label: '[mitt](https://www.npmjs.com/package/mitt)'
      }
    ]
  },
  {
    items: [
      {
        label: '[motion](https://www.npmjs.com/package/motion)'
      }
    ]
  },
  {
    items: [
      {
        label: '[nuxt](https://www.npmjs.com/package/nuxt)'
      }
    ]
  },
  {
    items: [
      {
        label: '[universal-cookie](https://www.npmjs.com/package/universal-cookie)'
      }
    ]
  },
  {
    items: [
      {
        label: '[vue](https://www.npmjs.com/package/vue)'
      }
    ]
  },
  {
    items: [
      {
        label: '[wheel-gestures](https://www.npmjs.com/package/wheel-gestures)'
      }
    ]
  },
]"
/>

### Auto Installation

Both npm (starting from version 7) and bun automatically install peer dependencies. For pnpm we recommend adding a `.npmrc` file to the root of your project.

```ini
auto-install-peers=true
```

### Manual Installation

Alternatively, install them all with the following command or refer to the docs of each plugin to pick and choose what to install.

::: code-group

```sh [pnpm]
pnpm install @floating-ui/vue @maas/vue-autosize @maas/magic-timer @maas/vue-primitive @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap hls.js luxon mitt motion nuxt universal-cookie vue wheel-gestures
```

```sh [npm]
npm install @floating-ui/vue @maas/vue-autosize @maas/magic-timer @maas/vue-primitive @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap hls.js luxon mitt motion nuxt universal-cookie vue wheel-gestures
```

```sh [yarn]
yarn add @floating-ui/vue @maas/vue-autosize @maas/magic-timer @maas/vue-primitive @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap hls.js luxon mitt motion nuxt universal-cookie vue wheel-gestures
```

```sh [bun]
bun install @floating-ui/vue @maas/vue-autosize @maas/magic-timer @maas/vue-primitive @nuxt/kit @vueuse/core @vueuse/integrations defu focus-trap hls.js luxon mitt motion nuxt universal-cookie vue wheel-gestures
```

:::
