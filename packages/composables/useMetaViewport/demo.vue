<template>
  <div class="w-full flex justify-center gap-4">
    <div class="rounded flex flex-col w-60 gap-2 bg-gray-500/5">
      <button @click="setMetaViewport" class="w-full h-full px-6 py-4">
        Set meta viewport
      </button>
    </div>
    <div class="rounded flex flex-col w-60 gap-2 bg-gray-500/5">
      <button @click="resetMetaViewport" class="w-full h-full px-6 py-4">
        Reset meta viewport
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMetaViewport } from '@maas/vue-equipment/composables'

const { setMetaViewport, resetMetaViewport } = useMetaViewport()
</script>
