# MagicToast

MagicToast is a flexible collection of components paird with an API to trigger toasts from anywhere.

## Usage

```js
import { MagicToastPlugin } from '@maas/vue-equipment/plugins'
import { createApp } from 'vue'

const app = createApp({})

app.use(MagicToastPlugin)
```

### Toast

```vue
<template>
  <MagicToast id="magic-toast--demo" />
</template>
```

### Anatomy

```vue
<template>
  <button @click="addToast">Open</button>
</template>

<script setup>
import { useToastApi } from '@maas/vue-equipment/plugins'

const component = defineAsyncComponent(() => import('~/Toast.vue'))
const toastApi = useToastApi(id)
const { add } = toastApi

function addToast() {
  add({ component })
}
</script>
```
