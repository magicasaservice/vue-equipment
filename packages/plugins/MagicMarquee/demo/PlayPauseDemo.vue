<template>
  <div class="flex flex-col items-center gap-8">
    <magic-marquee
      id="magic-marquee-play-pause-demo"
      class="bg-surface-base text-surface rounded-surface-sm py-6"
    >
      <span>Magic as a Service™</span>
      <span>Vue Equipment</span>
    </magic-marquee>

    <div class="flex w-full max-w-xs gap-2">
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
