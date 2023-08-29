<template>
  <div
    class="bg-gray-300 text-black rounded-md p-4 w-[250px] max-w-sm text-sm pointer-events-auto cursor-pointer"
    @click="emit('close')"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
}

const emit = defineEmits(['close'])
const props = defineProps<Props>()
</script>
