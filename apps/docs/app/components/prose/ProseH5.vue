<template>
  <h5
    :id="id"
    class="docs-body-sm text-surface mt-6 mb-1.5 font-medium first:mt-0"
  >
    <slot />
  </h5>
</template>

<script setup lang="ts">
defineProps<{ id?: string }>()
</script>
