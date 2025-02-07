<template>
  <div class="flex flex-col gap-8 items-center">
    <magic-marquee
      id="magic-marquee-play-pause-demo"
      class="bg-surface-elevation-base text-surface py-6 rounded-surface-sm"
    >
      <span>Magic as a Service™</span>
      <span>Vue Equipment</span>
    </magic-marquee>

    <div class="flex gap-2 w-full max-w-xs">
      <m-button v-if="!isPlaying" block @click="play">Play</m-button>
      <m-button v-else-if="isPlaying" block @click="pause">Pause</m-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import { useMagicMarquee } from '@maas/vue-equipment/plugins'

const { play, pause, isPlaying } = useMagicMarquee(
  'magic-marquee-play-pause-demo'
)
</script>
