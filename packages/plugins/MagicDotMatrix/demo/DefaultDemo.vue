<template>
  <div class="flex w-full items-center justify-center py-8">
    <magic-dot-matrix
      id="magic-dot-matrix-default-demo"
      class="w-24"
      :sequence="sequence"
    />
  </div>
</template>

<script lang="ts" setup>
import { createRipple } from '@maas/vue-equipment/plugins/MagicDotMatrix'

const sequence = createRipple({ cols: 7, rows: 7 })
</script>
