<template>
  <div
    class="bg-component-primary-translucent text-component-primary-onTranslucent type-label-text-lg pointer-events-auto flex w-[320px] items-center justify-between rounded-[1.375rem] p-2 pl-4 backdrop-blur-xl"
  >
    <slot>
      <span v-if="message">{{ message }}</span>
    </slot>
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
  message?: string
}
defineProps<DemoToastProps>()
const emit = defineEmits<{
  (e: 'remove'): void
}>()
</script>
