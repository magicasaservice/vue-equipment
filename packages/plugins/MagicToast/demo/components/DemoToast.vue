<template>
  <div
    class="bg-component-primary-translucent backdrop-blur-xl text-component-primary-onTranslucent type-label-text-lg rounded-[1.375rem] p-2 pl-4 w-[320px] pointer-events-auto flex justify-between items-center"
  >
    <span>{{ message }}</span>
    <m-button
      size="md"
      mode="translucent"
      icon
      square
      @click.stop="emit('remove')"
    >
      <i-maas-close-500 class="h-4 w-4" />
    </m-button>
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
