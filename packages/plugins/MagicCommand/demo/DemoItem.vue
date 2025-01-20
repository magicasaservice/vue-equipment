<template>
  <div class="px-2">
    <span
      class="p-2 flex items-center rounded-md"
      :class="{ 'bg-neutral-700': isActive }"
    >
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isActive?: boolean
}

defineProps<Props>()
</script>
