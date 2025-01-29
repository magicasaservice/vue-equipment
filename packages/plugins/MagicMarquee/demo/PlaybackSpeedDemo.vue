<template>
  <div class="flex flex-col gap-8 items-center justify-center">
    <magic-marquee
      id="magic-marquee-playback-speed-demo"
      class="bg-surface-elevation-base text-surface py-6 rounded-surface-sm"
    >
      <span>Magic as a Service™</span>
      <span>Vue Equipment</span>
    </magic-marquee>

    <div class="flex gap-2 w-full max-w-xs">
      <m-button block @click="decreaseSpeed(factor)">Slower</m-button>
      <m-input v-model="factor" type="number" label="Factor" block />
      <m-button block @click="increaseSpeed(factor)">Faster</m-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { MButton, MInput } from '@maas/mirror/vue'
import { useMagicMarquee } from '@maas/vue-equipment/plugins'

const factor = ref(1)

const { increaseSpeed, decreaseSpeed } = useMagicMarquee(
  'magic-marquee-playback-speed-demo'
)
</script>
