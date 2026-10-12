<template>
  <h2 :id="id" class="docs-h2 text-balance">
    <slot />
    <prose-heading-anchor :id="id" />
  </h2>
</template>

<script setup lang="ts">
defineProps<{ id?: string }>()
</script>
