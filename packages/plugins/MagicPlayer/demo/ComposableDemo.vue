<template>
  <div class="w-full flex flex-col gap-4 items-center">
    <div class="w-full aspect-[16/9]">
      <magic-player-provider
        id="composable-demo-player"
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
import { useMagicPlayer } from '@maas/vue-equipment/plugins'
const playerApi = useMagicPlayer('composable-demo-player')
</script>
