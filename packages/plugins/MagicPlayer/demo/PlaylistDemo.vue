<template>
  <div class="flex w-full flex-col items-center gap-4">
    <div class="aspect-16/9 w-full">
      <magic-player-provider
        id="magic-player-playlist-demo"
        :options="{
          src: [
            'https://stream.mux.com/kj7uNjRztuyNotBkAI55oUeVKSSN1C4ONrIYuYcRKxo/highest.mp4',
            'https://stream.mux.com/kj7uNjRztuyNotBkAI55oUeVKSSN1C4ONrIYuYcRKxo/highest.mp4',
            'https://stream.mux.com/kj7uNjRztuyNotBkAI55oUeVKSSN1C4ONrIYuYcRKxo/highest.mp4',
          ],
        }"
      >
        <magic-player-video />
        <magic-player-overlay />
        <magic-player-video-controls />
      </magic-player-provider>
    </div>
    <div class="flex items-center gap-4">
      <m-button :disabled="playlistIndex <= 0" @click="prev()">Prev</m-button>
      <span class="tabular-nums">
        {{ playlistIndex + 1 }} / {{ playlistCount }}
      </span>
      <m-button :disabled="playlistIndex >= playlistCount - 1" @click="next()">
        Next
      </m-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMagicPlayer } from '@maas/vue-equipment/plugins/MagicPlayer'

const { playlistIndex, playlistCount, next, prev } = useMagicPlayer(
  'magic-player-playlist-demo'
)
</script>

<style>
@import '@maas/vue-equipment/plugins/MagicPlayer/css/magic-player-video-controls.css';
</style>
