<template>
  <h6 :id="id" class="docs-label mt-6 mb-1 first:mt-0">
    <slot />
  </h6>
</template>

<script setup lang="ts">
defineProps<{ id?: string }>()
</script>
