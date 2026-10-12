<template>
  <nav
    v-if="previous || next"
    aria-label="Pagination"
    class="flex items-start justify-between gap-6"
  >
    <nuxt-link
      v-if="previous"
      :to="previous.path"
      class="text-surface-muted hover:text-surface docs-tap-grow min-w-0 transition-colors"
    >
      <span class="docs-label block">Previous</span>
      <span class="docs-body-sm mt-1 flex items-center gap-2">
        <base-icon
          name="arrow-w"
          aria-hidden="true"
          class="size-3.5 shrink-0"
        />
        <span class="truncate">{{ previous.title }}</span>
      </span>
    </nuxt-link>
    <span v-else />

    <nuxt-link
      v-if="next"
      :to="next.path"
      class="text-surface-muted hover:text-surface docs-tap-grow min-w-0 text-right transition-colors"
    >
      <span class="docs-label block">Next</span>
      <span class="docs-body-sm mt-1 flex items-center gap-2">
        <span class="truncate">{{ next.title }}</span>
        <base-icon
          name="arrow-e"
          aria-hidden="true"
          class="size-3.5 shrink-0"
        />
      </span>
    </nuxt-link>
    <span v-else />
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: surroundings } = await useAsyncData(
  () => `surroundings-${route.path}`,
  () =>
    queryCollectionItemSurroundings('docs', route.path, {
      fields: ['title', 'path'],
    })
)

const previous = computed(() => surroundings.value?.[0] ?? null)
const next = computed(() => surroundings.value?.[1] ?? null)
</script>
