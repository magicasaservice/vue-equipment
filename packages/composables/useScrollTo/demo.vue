<template>
  <div class="flex flex-wrap gap-4">
    <div
      ref="parentRef"
      class="w-300px h-300px m-auto overflow-scroll bg-gray-500/5 rounded snap-both snap-mandatory"
    >
      <div class="w-900px h-900px relative">
        <div position="absolute left-0 top-0" bg="gray-500/5" p="x-2 y-1">
          TopLeft
        </div>
        <div
          ref="elRef"
          position="absolute bottom-0 right-0"
          bg="gray-500/5"
          p="x-2 y-1"
        >
          Target
        </div>
      </div>
    </div>
    <div class="m-auto rounded flex flex-col w-60 gap-2 bg-gray-500/5">
      <button @click="scroll()" class="w-full h-full px-6 py-4">
        Click to scroll
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScrollTo } from '@maas/vue-equipment/composables'
import { easeInQuad } from '@maas/vue-equipment/utils'

const { scrollToTarget } = useScrollTo()

const elRef = ref()
const parentRef = ref()

const scroll = () => {
  scrollToTarget({
    target: elRef,
    parent: parentRef,
    speed: 200,
    easing: easeInQuad,
  })
}
</script>
