<template>
  <aside
    aria-label="Documentation"
    class="sticky top-[var(--docs-header)] hidden h-[calc(100svh-var(--docs-header))] w-[var(--docs-sidebar)] shrink-0 flex-col pr-6 lg:flex"
  >
    <div class="docs-rail min-h-0 flex-1 overflow-y-auto py-6">
      <docs-sidebar-nav :navigation="navigation ?? []" />
    </div>

    <div v-if="moreLinks.length" class="shrink-0 pt-3 pb-6">
      <ul class="flex flex-col gap-1">
        <li v-for="link in moreLinks" :key="link.href">
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
    </div>
  </aside>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()
const moreLinks = computed(() => appConfig.moreLinks ?? [])

const { data: navigation } = await useDocsNavigation()
</script>
