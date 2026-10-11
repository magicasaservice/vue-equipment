<template>
  <a
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    class="docs-link"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
const props = defineProps<{ href?: string }>()
const isExternal = computed(() => props.href?.startsWith('http') ?? false)
</script>
