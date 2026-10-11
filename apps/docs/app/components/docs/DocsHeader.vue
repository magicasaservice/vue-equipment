<template>
  <header class="mb-8">
    <h1 v-if="title" class="docs-h1 text-balance">{{ title }}</h1>

    <p v-if="description" class="docs-lede mt-3 text-pretty">
      {{ description }}
    </p>
  </header>
</template>

<script setup lang="ts">
interface DocsHeaderProps {
  title?: string
  description?: string
}

const { title, description } = defineProps<DocsHeaderProps>()
</script>
