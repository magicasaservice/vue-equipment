<template>
  <span>{{ message }}</span>
</template>

<script lang="ts" setup>
interface DemoSlotProps {
  message?: string
}

defineProps<DemoSlotProps>()
</script>
