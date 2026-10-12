<template>
  <h1 :id="id" class="docs-h1 mt-14 text-balance first:mt-0">
    <slot />
  </h1>
</template>

<script setup lang="ts">
defineProps<{ id?: string }>()
</script>
