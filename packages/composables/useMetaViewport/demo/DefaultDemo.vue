<template>
  <div class="flex w-full flex-col items-center gap-6">
    <div class="flex w-full justify-center gap-4">
      <m-button @click="setMetaViewport">Set meta viewport</m-button>
      <m-button @click="resetMetaViewport">Reset meta viewport</m-button>
    </div>
    <span class="type-surface-body-sm text-surface-subtle">
      Inspect the meta viewport in your browser console.
    </span>
  </div>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import { useMetaViewport } from '@maas/vue-equipment/composables'

const { setMetaViewport, resetMetaViewport } = useMetaViewport()
</script>
