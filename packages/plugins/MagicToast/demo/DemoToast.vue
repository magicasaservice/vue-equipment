<template>
  <div
    class="bg-surface-elevation-base text-surface type-label-text-lg rounded-[1.375rem] p-2 pl-4 w-[320px] pointer-events-auto cursor-pointer flex justify-between items-center"
  >
    <span>{{ message }}</span>
    <m-button size="sm" @click.stop="emit('remove')">Close</m-button>
  </div>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'

interface DemoToastProps {
  message: string
}
defineProps<DemoToastProps>()
const emit = defineEmits<{
  (e: 'remove'): void
}>()
</script>
