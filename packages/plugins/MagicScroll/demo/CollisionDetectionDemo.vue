<template>
  <magic-scroll-provider
    :target="parentRef"
    class="w-full aspect-[16/9] bg-surface-elevation-base"
  >
    <div ref="parentRef" class="relative w-full h-full overflow-auto">
      <magic-scroll-scene
        class="h-[400svh] flex flex-col justify-evenly items-center px-8"
      >
        <magic-scroll-collision
          v-for="i in 4"
          :key="i"
          class="h-20 bg-surface-elevation-high w-full flex items-center justify-center"
        >
          <span class="type-body-sm">Collision</span>
        </magic-scroll-collision>
      </magic-scroll-scene>
    </div>
  </magic-scroll-provider>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'

const parentRef = ref<HTMLElement | undefined>(undefined)

function callback(payload: MagicEmitterEvents['collision']) {
  console.log(payload)
}

useMagicEmitter().on('collision', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('collision', callback)
})
</script>
