<template>
  <div
    class="bg-primary-solid text-primary-on-solid type-label-text-lg pointer-events-auto flex w-[320px] items-center justify-between rounded-full py-2 pr-2 pl-6"
    :style="{ opacity }"
  >
    <span v-if="message">{{ message }}</span>
    <m-button
      size="md"
      variant="secondary"
      mode="translucent"
      icon
      square
      round
      @click.stop="emit('remove')"
    >
      <i-maas-close-500 class="h-4 w-4" />
    </m-button>
  </div>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'

interface FadeDemoToastProps {
  message?: string
  opacity?: number
}
withDefaults(defineProps<FadeDemoToastProps>(), { opacity: 1 })
const emit = defineEmits<{
  (e: 'remove'): void
}>()
</script>
