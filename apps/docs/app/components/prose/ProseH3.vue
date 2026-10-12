<template>
  <h3 :id="id" class="docs-h3 text-balance">
    <slot />
    <prose-heading-anchor :id="id" />
  </h3>
</template>

<script setup lang="ts">
defineProps<{ id?: string }>()
</script>
