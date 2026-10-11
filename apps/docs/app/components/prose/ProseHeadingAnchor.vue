<template>
  <a
    v-if="id"
    :href="`#${id}`"
    :aria-label="'Link to this section'"
    class="docs-anchor text-surface-muted hover:text-surface inline-block align-middle"
  >
    <base-icon name="link" aria-hidden="true" class="size-3.5" />
  </a>
</template>

<script setup lang="ts">
defineProps<{ id?: string }>()
</script>
