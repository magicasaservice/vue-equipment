<template>
  <div class="flex w-full flex-col items-center gap-4">
    <div class="aspect-[16/9] w-full">
      <magic-player-provider
        id="magic-player-composable-demo"
        :options="{
          autoplay: true,
          loop: true,
          src: 'https://stream.mux.com/kj7uNjRztuyNotBkAI55oUeVKSSN1C4ONrIYuYcRKxo/highest.mp4',
        }"
      >
        <magic-player-video />
      </magic-player-provider>
    </div>
    <div class="flex gap-4">
      <m-button @click="playerApi.videoApi.togglePlay()">
        Toggle Play
      </m-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMagicPlayer } from '@maas/vue-equipment/plugins/MagicPlayer'
const playerApi = useMagicPlayer('magic-player-composable-demo')
</script>
