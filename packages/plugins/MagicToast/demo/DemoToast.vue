<template>
  <div
    class="bg-gray-300 text-black rounded-md p-3 w-[250px] max-w-sm text-sm pointer-events-auto cursor-pointer flex items-center"
  >
    {{ message }}
    <button
      @click="emit('close')"
      class="text-xs bg-gray-900/5 ml-auto p-2 rounded-full"
    >
      Close
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
}

const emit = defineEmits(['close'])
const props = defineProps<Props>()
</script>
