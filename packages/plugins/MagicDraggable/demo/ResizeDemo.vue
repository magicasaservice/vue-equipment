<template>
  <magic-draggable
    id="magic-draggable-resize-demo"
    class="bg-surface-base rounded-md"
    :options="{
      threshold: {
        lock: 10,
      },
    }"
  >
    <div
      :class="[
        'bg-surface-high flex w-40 items-center justify-center rounded-md transition-all duration-150',
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
[data-id='magic-draggable-resize-demo'] {
  --magic-draggable-position: relative;
  --magic-draggable-z-index: 50;
  --magic-draggable-height: 20rem;
}
</style>
