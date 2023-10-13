# Magic Noise

A magic plugin for pixelated static noise

## Usage

```js
import { MagicNoisePlugin } from '@maas/vue-equipment/plugins'
import { createApp } from 'vue'

const app = createApp({})

app.use(MagicNoisePlugin)
```

```vue
<template>
  <magic-noise :style="{ width: '100%', height: '500px' }" />
</template>
```
