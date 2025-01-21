<template>
  <div
    class="bg-surface-elevation-high text-surface type-label-text-xl rounded-2xl p-3 w-[250px] max-w-sm pointer-events-auto cursor-pointer flex justify-between items-center"
  >
    <span>{{ message }}</span>
    <m-button size="xs" @click="emit('close')"> Close </m-button>
  </div>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'

interface Props {
  message: string
}

const emit = defineEmits(['close'])
defineProps<Props>()
</script>
