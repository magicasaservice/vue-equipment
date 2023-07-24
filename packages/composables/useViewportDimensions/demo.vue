<template>
  <div class="w-full flex flex-col gap-4">
    <div class="w-full flex flex-wrap gap-4 items-stretch">
      <div
        class="demo-box flex items-center justify-center text-xs text-center p-2 bg-gray-500/5 rounded"
      >
        Change on resize
      </div>
      <div>
        <pre class="h-full flex flex-col my-0 justify-center">
        <span>width: calc(10 * var(--vw, 1vw))</span>
        <span>height: calc(10 * var(--vh, 1vh))</span>
      </pre>
      </div>
    </div>
    <div class="w-full flex flex-wrap gap-4 items-stretch">
      <div
        class="demo-box--initial flex items-center justify-center text-xs text-center p-2 bg-gray-500/5 rounded"
      >
        Fixed on load
      </div>
      <div>
        <pre class="h-full flex flex-col my-0 justify-center">
        <span>width: calc(10 * var(--initial-vw, 1vw))</span>
        <span>height: calc(10 * var(--initial-vh, 1vh))</span>
      </pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useViewportDimensions } from '@maas/vue-equipment/composables'

useViewportDimensions()
</script>

<style scoped>
.demo-box {
  width: calc(10 * var(--vw, 1vw));
  height: calc(10 * var(--vh, 1vh));
}

.demo-box--initial {
  width: calc(10 * var(--initial-vw, 1vw));
  height: calc(10 * var(--initial-vh, 1vh));
}
</style>
