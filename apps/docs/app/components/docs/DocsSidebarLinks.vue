<template>
  <ul v-if="links.length" class="flex flex-col gap-1">
    <li v-for="link in links" :key="link.href">
      <docs-menu-item
        as="a"
        size="xs"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ link.label }}
      </docs-menu-item>
    </li>
  </ul>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()
const links = computed(() => appConfig.moreLinks ?? [])
</script>
