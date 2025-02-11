<template>
  <magic-scroll-provider
    :target="parentRef"
    class="w-full aspect-[16/9] bg-surface-elevation-base"
  >
    <div ref="parentRef" class="relative w-full h-full overflow-auto">
      <magic-scroll-scene
        v-slot="{ progress }"
        from="top-top"
        to="bottom-bottom"
        class="h-[400svh]"
      >
        <div
          class="sticky w-full top-0 p-4 mb-[-100%] type-surface-body-sm text-surface-subtle flex justify-between"
        >
          <span>{{ Math.round(progress * 100) }}%</span>
          <span>Scroll down</span>
        </div>
        <magic-scroll-motion
          :sequence="sequence"
          class="sticky w-full aspect-[16/9] top-0 flex items-center justify-center"
        >
          <div class="w-20 h-20 bg-surface-elevation-high" />
        </magic-scroll-motion>
      </magic-scroll-scene>
    </div>
  </magic-scroll-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const parentRef = ref<HTMLElement | undefined>(undefined)
const sequence = [
  [
    {
      x: ['0rem', '-5rem'],
      y: ['0rem', '5rem'],
      scale: [1, 1.25],
    },
  ],
  [
    {
      x: ['-5rem', '-5rem'],
      y: ['5rem', '-5rem'],
    },
    { delay: 0.5 },
  ],
  [
    {
      x: ['-5rem', '5rem'],
      y: ['-5rem', '-5rem'],
    },
    { delay: 0.5 },
  ],
  [
    {
      x: ['5rem', '5rem'],
      y: ['-5rem', '5rem'],
    },
    { delay: 0.5 },
  ],
  [
    {
      x: ['5rem', '0rem'],
      y: ['5rem', '0rem'],
      scale: [1.25, 1],
    },
    { delay: 0.5 },
  ],
]
</script>
