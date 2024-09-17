<template>
  <div class="flex flex-wrap gap-4">
    <div
      ref="parentRef"
      class="w-[300px] h-[300px] m-auto overflow-scroll bg-surface-elevation-base snap-both snap-mandatory"
    >
      <div class="w-[900px] h-[900px] relative">
        <div class="absolute left-0 top-0 bg-surface-elevation-high px-2 py-1">
          Top Left
        </div>
        <div
          ref="elRef"
          class="absolute bottom-0 right-0 bg-surface-elevation-high px-2 py-1"
        >
          Bottom Right
        </div>
      </div>
    </div>
    <m-button @click="scroll()"> Click to scroll </m-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MButton } from '@maas/mirror/vue'
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
