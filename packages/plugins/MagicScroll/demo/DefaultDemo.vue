<template>
  <magic-scroll-provider
    :target="parentRef"
    class="bg-surface-base aspect-[16/9] w-full"
  >
    <div ref="parent" class="relative h-full w-full overflow-auto">
      <magic-scroll-scene
        v-slot="{ progress }"
        from="top-top"
        to="bottom-bottom"
        class="h-[500svh]"
      >
        <div
          class="type-surface-body-sm text-surface-subtle sticky top-0 mb-[-100%] flex w-full justify-between p-4"
        >
          <span>{{ Math.round(progress * 100) }}%</span>
          <span>Scroll down</span>
        </div>
        <magic-scroll-motion
          :sequence="sequence"
          class="sticky top-0 flex aspect-[16/9] w-full items-center justify-center"
        >
          <div class="bg-surface-high h-20 w-20" />
        </magic-scroll-motion>
      </magic-scroll-scene>
    </div>
  </magic-scroll-provider>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue'

const parentRef = useTemplateRef('parent')
const sequence = [
  [
    {
      opacity: [0, 1],
    },
  ],
  [
    {
      x: ['0rem', '-5rem'],
      y: ['0rem', '5rem'],
      scale: [1, 1.25],
    },
    { delay: 0.5 },
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
