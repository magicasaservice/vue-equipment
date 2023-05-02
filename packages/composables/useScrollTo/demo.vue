<template>
  <div class="flex flex-wrap gap-4">
    <div
      ref="parent"
      class="w-300px h-300px m-auto overflow-scroll bg-gray-500/5 rounded"
    >
      <div class="w-900px h-900px relative">
        <div position="absolute left-0 top-0" bg="gray-500/5" p="x-2 y-1">
          TopLeft
        </div>
        <div
          ref="el"
          position="absolute bottom-0 right-0"
          bg="gray-500/5"
          p="x-2 y-1"
        >
          Target
        </div>
      </div>
    </div>
    <div
      class="m-auto px-6 py-4 rounded flex flex-col w-60 gap-2 bg-gray-500/5"
    >
      <button opacity="75" @click="scroll()">Click to scroll</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScrollTo, useEasings } from '@maas/vue-equipment/composables'

const { scrollToTarget } = useScrollTo()
const { easeInQuad } = useEasings()

const el = ref()
const parent = ref()

const scroll = () => {
  scrollToTarget({
    target: el,
    parent: parent,
    speed: 200,
    easing: easeInQuad,
  })
}
</script>
