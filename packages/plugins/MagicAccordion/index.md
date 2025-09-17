# MagicAccordion

MagicAccordion is a collection of components intended for building vertically stacked headlines where each reveals related content.

<component-preview src="./demo/DefaultDemo.vue"/>

<!--@include: @/apps/docs/src/content/snippets/overview.md-->

## Anatomy

```vue
<template>
  <magic-accordion-provider id="your-accordion-id">
    <magic-accordion-view>
      <magic-accordion-trigger>
        <!-- your content -->
      </magic-accordion-trigger>
      <magic-accordion-content>
        <!-- your content -->
      </magic-accordion-content>
    </magic-accordion-view>
  </magic-accordion-provider>
</template>

<script setup>
const { selectView } = useMagicAccordion('your-accordion-id')
</script>
```

<!--@include: @/apps/docs/src/content/snippets/installation.md-->

### Vue

If you are using Vue, import and add `MagicAccordionPlugin` to your app.

```js
import { createApp } from 'vue'
import { MagicAccordionPlugin } from '@maas/vue-equipment/plugins/MagicAccordion'

const app = createApp({})

app.use(MagicAccordionPlugin)
```

### Nuxt

The accordion is available as a Nuxt module. In your Nuxt config file add `@maas/vue-equipment/nuxt` to your modules and add `MagicAccordion` to the plugins in your configuration.

```js
export default defineNuxtConfig({
  modules: ['@maas/vue-equipment/nuxt'],
  vueEquipment: {
    plugins: ['MagicAccordion'],
  },
})
```

### Composable

In order to interact with the accordion from anywhere within your app, we provide a `useMagicAccordion` composable. Import it directly when needed.

```js
import { useMagicAccordion } from '@maas/vue-equipment/plugins/MagicAccordion'

const { selectView } = useMagicAccordion('your-accordion-id')

function handleClick() {
  selectView('your-view-id')
}
```

> [!TIP]
> If you have installed the accordion as a Nuxt module, the composable will be auto-imported and is automatically available in your Nuxt app.

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
          label: '[@maas/vue-autosize](https://www.npmjs.com/package/@maas/vue-autosize)'
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
  ]"
/>

### Installation

::: code-group

```sh [pnpm]
pnpm install @nuxt/kit @maas/vue-autosize @maas/vue-primitive @vueuse/core
```

```sh [npm]
npm install @nuxt/kit @maas/vue-autosize @maas/vue-primitive @vueuse/core
```

```sh [yarn]
yarn add @nuxt/kit @maas/vue-autosize @maas/vue-primitive @vueuse/core
```

```sh [bun]
bun install @nuxt/kit @maas/vue-autosize @maas/vue-primitive @vueuse/core
```

:::

## API Reference

### MagicAccordionProvider

The MagicAccordionProvider wraps the accordion and configures all child components according to the provided [options](#options).

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
          label: 'MagicAccordionOptions'
        },
        {
          label: 'false'
        }
      ]
    },
  ]"
/>

#### Options

To customize the accordion, override the necessary options. Any custom options will be merged with the default options.

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
          description: 'Set mode to multiple to allow multiple views to be open in parallel.'
        },
        { label: 'AccordionMode',
          description: '\'single\' | \'multiple\''
        },
        { 
          label: 'single'
        }
      ]
    },
    {
      items: [
        { 
          label: 'transition',
          description: 'Override the [transition name](https://vuejs.org/guide/built-ins/transition#named-transitions) of nested `MagicAccordionContent` elements.'
        },
        { 
          label: 'string'
        },
        { 
          label: 'string',
          description: '\'magic-accordion\'',
        }
      ]
    },
    {
      items: [
        {
          label: 'animation.duration',
          description: 'Configure the accordions’s animation duration.'
        },
        {
          label: 'number'
        },
        {
          label: '200'
        }
      ]
    },
    {
      items: [
        {
          label: 'animation.easing',
          description: 'Configure the accordions’s animation easing.'
        },
        {
          label: 'function',
          description: '(t: number) => number'
        },
        {
          label: 'easeOutQuad',
          description: 't * (2 - t)'
        }
      ]
    },
    {
      items: [
        { 
          label: 'disabled',
          description: 'Disable the accordion completely.'
        },
        { 
          label: 'boolean'
        },
        { 
          label: 'false',
        }
      ]
    },
  ]"
/>

### MagicAccordionView

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
          description: 'Providing an id is optional. Neccessary for interacting with the view through `useMagicAccordion`.'
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
          label: 'active',
          description: 'Force active state on mounted.'
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

### MagicAccordionContent

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
          label: 'asChild',
          description: 'Prevent the inner component inside the `<transition>` from rendering and pass all functionality to a child element.'
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
          label: 'transition',
          description: 'Override the [transition name](https://vuejs.org/guide/built-ins/transition#named-transitions).'
        },
        { 
          label: 'string' },
        { 
          label: 'false',
        }
      ]
    },
    {
      items: [
        {
          label: 'animation.duration',
          description: 'Override the component’s animation duration.'
        },
        {
          label: 'number'
        },
        {
          label: 'false'
        }
      ]
    },
    {
      items: [
        {
          label: 'animation.easing',
          description: 'Override the component’s animation easing.'
        },
        {
          label: 'function',
          description: '(t: number) => number'
        },
        {
          label: 'false'
        }
      ]
    },
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
          label: '--magic-accordion-content-clip-path'
        },
        {
          label: 'inset(0)'
        },
      ]
    }
  ]"
/>

### MagicAccordionTrigger

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
          description: 'Array<\'click\' | \'mouseenter\'>',
        },
        {
          label: 'false'
        }
      ]
    },
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
          label: '--magic-accordion-trigger-cursor-disabled'
        },
        {
          label: 'not-allowed'
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
        { label: 'MagicAccordionContent' },
        { label: 'missing_instance_id' },
        { label: 'MagicAccordionContent must be nested inside MagicAccordionProvider' }
      ]
    },
    {
      items: [
        { label: 'MagicAccordionContent' },
        { label: 'missing_view_id' },
        { label: 'MagicAccordionContent must be nested inside MagicAccordionView' }
      ]
    },
    {
      items: [
        { label: 'MagicAccordionTrigger' },
        { label: 'missing_instance_id' },
        { label: 'MagicAccordionTrigger must be nested inside MagicAccordionProvider' }
      ]
    },
    {
      items: [
        { label: 'MagicAccordionTrigger' },
        { label: 'missing_view_id' },
        { label: 'MagicAccordionTrigger must be nested inside MagicAccordionView or a viewId must be provided' }
      ]
    },
    {
      items: [
        { label: 'MagicAccordionView' },
        { label: 'missing_instance_id' },
        { label: 'MagicAccordionView must be nested inside MagicAccordionProvider' }
      ]
    }
  ]"
/>
