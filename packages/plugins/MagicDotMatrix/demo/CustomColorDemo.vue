<template>
  <div class="flex w-full items-center justify-center py-8">
    <magic-dot-matrix
      id="magic-dot-matrix-custom-color-demo"
      class="w-32 rounded-xl p-4"
      :sequence="sequence"
    />
  </div>
</template>

<script lang="ts" setup>
import { createEqualizer } from '@maas/vue-equipment/plugins/MagicDotMatrix'

const sequence = createEqualizer({ cols: 7, rows: 7 })
</script>

<style>
[data-id='magic-dot-matrix-custom-color-demo'] {
  --magic-dot-matrix-radius: 0.5;
  --magic-dot-matrix-color: var(--app-color-accent-bg-solid);
  --magic-dot-matrix-inactive-color: var(--app-color-accent-bg-muted);
  background: oklch(0.16 0.03 264);
}
</style>
