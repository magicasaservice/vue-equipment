<template>
  <aside
    aria-label="Documentation"
    class="sticky top-(--docs-header) hidden h-[calc(100svh-var(--docs-header))] w-(--docs-sidebar) shrink-0 flex-col pr-6 lg:flex"
  >
    <div class="docs-rail min-h-0 flex-1 scrollbar-none overflow-y-auto py-6">
      <docs-sidebar-nav :navigation="navigation ?? []" />
      <docs-sidebar-links class="mt-8" />
    </div>
  </aside>
</template>

<script setup lang="ts">
const { data: navigation } = await useDocsNavigation()
</script>
