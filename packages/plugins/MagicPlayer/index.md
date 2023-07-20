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
  import { MagicPlayer, MagicPlayerControls } from '@maas/vue-equipment;
</script>
```

### HLS

```html
<template>
  <magic-player
    provider="hls"
    src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks.m3u8"
  >
    <magic-player-controls />
  </magic-player>
</template>

<script setup>
  import { MagicPlayer, MagicPlayerControls } from '@maas/vue-equipment;
</script>
```

### Mux Timeline Preview

```html
<template>
  <magic-player
    provider="file"
    src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
  >
    <magic-player-controls>
      <template #seekPopover="{ seekedTime, touched }">
        <magic-player-mux-timeline-preview
          v-if="touched"
          playbackId="c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks"
          :time="seekedTime"
          class="mb-[1rem] w-[10rem] rounded-[4px] overflow-hidden"
        />
      </template>
    </magic-player-controls>
  </magic-player>
</template>

<script setup>
  import { MagicPlayer, MagicPlayerControls, MagicPlayerMuxTimelinePreview } from '@maas/vue-equipment;
</script>
```
