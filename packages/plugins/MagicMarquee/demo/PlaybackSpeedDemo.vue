<template>
  <div class="flex flex-col items-center justify-center gap-8">
    <magic-marquee
      id="magic-marquee-playback-speed-demo"
      class="bg-surface-elevation-base text-surface rounded-surface-sm py-6"
    >
      <span>Magic as a Service™</span>
      <span>Vue Equipment</span>
    </magic-marquee>

    <div class="flex w-full max-w-xs gap-2">
      <m-button block @click="decreaseSpeed(factor)">Slower</m-button>
      <m-button block @click="increaseSpeed(factor)">Faster</m-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { MButton } from '@maas/mirror/vue'
import { useMagicMarquee } from '@maas/vue-equipment/plugins'

const factor = ref(1)

const { increaseSpeed, decreaseSpeed } = useMagicMarquee(
  'magic-marquee-playback-speed-demo'
)
</script>
