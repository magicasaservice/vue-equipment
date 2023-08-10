<template>
  <div class="flex flex-col gap-8 font-bold">
    <magic-marquee class="bg-gray-500/5 py-4">
      <div class="flex gap-4">
        <span>Magic Marquee</span>
        <span>News Update</span>
        <span>Loud Headline</span>
      </div>
    </magic-marquee>
    <magic-marquee :speed="5" class="bg-gray-500/5 py-4">
      <div class="flex gap-4">
        <span>Fast Marquee</span>
        <span>Instant Update</span>
        <span>Noisy Headline</span>
      </div>
    </magic-marquee>
    <magic-marquee class="bg-gray-500/5 py-4" id="magic-marquee--full">
      <span class="w-screen">Magic Marquee with full width content</span>
    </magic-marquee>
    <magic-marquee
      class="bg-gray-500/5 py-4 cursor-pointer"
      :speed="speed"
      @click="increaseSpeed"
    >
      <div class="flex gap-4">
        <span>Click me to increase my speed!</span>
      </div>
    </magic-marquee>
    <magic-marquee
      class="bg-gray-500/5 py-4 cursor-pointer"
      ref="toggleDemo"
      @click="togglePlay"
    >
      <div class="flex gap-4">
        <span>Click me to toggle playback</span>
      </div>
    </magic-marquee>
    <magic-marquee
      class="bg-gray-500/5 py-4 cursor-pointer"
      :direction="direction"
      @click="toggleDirection"
    >
      <div class="flex gap-4">
        <span>Click me to switch direction</span>
      </div>
    </magic-marquee>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import MagicMarquee from './src/components/MagicMarquee.vue'

const speed = ref(1)

function increaseSpeed() {
  speed.value += 1
}

const toggleDemo = ref<InstanceType<typeof MagicMarquee> | undefined>(undefined)

function togglePlay() {
  if (toggleDemo.value.playing) {
    toggleDemo.value.pause()
  } else {
    toggleDemo.value.play()
  }
}

const direction = ref<'reverse' | 'normal'>('normal')

function toggleDirection() {
  direction.value = direction.value === 'normal' ? 'reverse' : 'normal'
}
</script>

<style lang="css">
#magic-marquee--full {
  --magic-marquee-content-width: 100%;
}
</style>
