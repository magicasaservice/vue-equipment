<template>
  <!-- Under the h1 and its lede. Both links are as useful to a model reading
       the page as to a person editing it. -->
  <p class="mt-5 mb-8 flex flex-wrap items-center gap-x-5 gap-y-2">
    <a
      v-for="action in actions"
      :key="action.label"
      :href="action.href"
      target="_blank"
      rel="noopener noreferrer"
      class="docs-caption text-surface-muted hover:text-surface docs-tap inline-flex items-center gap-1.5 transition-colors"
    >
      <base-icon
        :name="action.icon"
        aria-hidden="true"
        class="size-3.5 shrink-0"
      />
      {{ action.label }}
    </a>
  </p>
</template>

<script setup lang="ts">
interface DocsPageActionsProps {
  // The page’s file relative to the repository, e.g.
  // `packages/plugins/MagicDrawer/index.md`.
  source: string
  // The page’s route, e.g. `/plugins/MagicDrawer`.
  path: string
}

const { source, path } = defineProps<DocsPageActionsProps>()

const { repositoryUrl } = useAppConfig()

const actions = computed(() => [
  {
    label: 'View source',
    href: `${repositoryUrl}/blob/main/${source}`,
    icon: 'document' as const,
  },
  {
    label: 'View as Markdown',
    href: `/raw${path}.md`,
    icon: 'md' as const,
  },
])
</script>
