<template>
  <div
    class="bg-surface-elevation-base text-surface type-label-text-xl rounded-[1rem] p-2 w-[300px] pointer-events-auto cursor-pointer flex justify-between items-center"
  >
    <span>{{ message }}</span>
    <m-button size="sm" @click.stop="emit('remove')"> Close </m-button>
  </div>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'

interface Props {
  message: string
}

const emit = defineEmits(['remove'])
defineProps<Props>()
</script>
