<template>
  <div
    class="bg-surface-elevation-high text-surface type-label-text-xl rounded-2xl p-3 w-[250px] max-w-sm pointer-events-auto cursor-pointer flex justify-between items-center"
  >
    <span>{{ message }}</span>
    <m-button @click="emit('close')" size="xs"> Close </m-button>
  </div>
</template>

<script setup lang="ts">
import { MButton } from '@maas/mirror/vue'

interface Props {
  message: string
}

const emit = defineEmits(['close'])
defineProps<Props>()
</script>
