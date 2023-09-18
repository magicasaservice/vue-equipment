# Magic Player

A magic video player.

## Usage

```js
import { MagicPlayerPlugin } from '@maas/vue-equipment/plugins'
import { createApp } from 'vue'

const app = createApp({})

app.use(MagicPlayerPlugin)
```

```html
<template>
  <magic-player
    src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
  >
    <magic-player-controls />
  </magic-player>
</template>
```
