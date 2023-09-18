# Magic Modal

A simple component and api to trigger modals from anywhere

## Usage

```js
import { MagicModalPlugin } from '@maas/vue-equipment/plugins'
import { createApp } from 'vue'

const app = createApp({})

app.use(MagicModalPlugin)
```

### Modal

```html
<template>
  <MagicModal id="magic-modal--demo">
    <div tabindex="1" />
  </MagicModal>
</template>
```

### Trigger

```html
<template>
  <button @click="open">Open</button>
</template>

<script setup>
  import { useModalApi } from '@maas/vue-equipment/plugins'

  const modalApi = useModalApi('magic-modal--demo')
  const { open } = modalApi
</script>
```
