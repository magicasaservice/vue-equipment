<template>
  <magic-draggable
    id="magic-draggable-demo"
    class="bg-surface-elevation-base w-full h-[20rem] rounded-md"
  >
    <div
      :class="[
        'bg-surface-elevation-high w-40 rounded-md flex items-center justify-center transition-all duration-150',
        {
          'aspect-square': square,
          'aspect-[2/3]': !square,
        },
      ]"
    >
      <m-button @click="toggle">Resize</m-button>
    </div>
  </magic-draggable>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { MButton } from '@maas/mirror/vue'

const square = ref(true)

function toggle() {
  square.value = !square.value
}
</script>

<style>
[data-id='magic-draggable-demo'] {
  --magic-draggable-position: relative;
  --magic-draggable-z-index: 50;
}
</style>
