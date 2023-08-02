# Magic Player

A magic plugin that adds a player to the page.

## Usage

### File

```html
<template>
  <magic-player
    src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
  >
    <magic-player-controls />
  </magic-player>
</template>

<script setup>
  import { MagicPlayer, MagicPlayerControls } from '@maas/vue-equipment
</script>
```

### HLS

```html
<template>
  <magic-player
    src-type="hls"
    src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks.m3u8"
  >
    <magic-player-controls />
  </magic-player>
</template>

<script setup>
  import { MagicPlayer, MagicPlayerControls } from '@maas/vue-equipment
</script>
```

### Mux Popover

```html
<template>
  <magic-player
    src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
  >
    <magic-player-controls ref="controls">
      <template #seekPopover>
        <magic-player-mux-popover
          playbackId="c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks"
        />
      </template>
    </magic-player-controls>
  </magic-player>
</template>

<script setup>
  import { MagicPlayer, MagicPlayerControls, MagicPlayerMuxPopover } from '@maas/vue-equipment
</script>
```
