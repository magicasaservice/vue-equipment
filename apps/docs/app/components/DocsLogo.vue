<template>
  <span class="flex items-center gap-2">
    <i-maas-carabiner-500 aria-hidden="true" class="size-6" />
    <span class="docs-wordmark">{{ docs.title }}</span>
  </span>
</template>

<script setup lang="ts">
const { docs } = useAppConfig()
</script>
