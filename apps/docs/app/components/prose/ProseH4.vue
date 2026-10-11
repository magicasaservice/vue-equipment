<template>
  <h4 :id="id" class="docs-h4 mt-7 mb-1.5 first:mt-0">
    <slot />
    <prose-heading-anchor :id="id" />
  </h4>
</template>

<script setup lang="ts">
defineProps<{ id?: string }>()
</script>
