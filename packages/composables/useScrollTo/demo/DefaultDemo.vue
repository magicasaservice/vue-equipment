<template>
  <div class="flex w-full flex-col items-center gap-4">
    <div
      ref="parentRef"
      class="bg-surface-elevation-base aspect-[16/9] w-full snap-both snap-mandatory overflow-scroll"
    >
      <div
        class="type-surface-body-sm text-surface-subtle relative h-[900px] w-[900px]"
      >
        <div class="bg-surface-elevation-high absolute left-0 top-0 px-2 py-1">
          Top Left
        </div>
        <div
          ref="elRef"
          class="bg-surface-elevation-high absolute bottom-0 right-0 px-2 py-1"
        >
          Bottom Right
        </div>
      </div>
    </div>
    <m-button @click="scroll()">Scroll</m-button>
  </div>
</template>

<script lang="ts" setup>
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
