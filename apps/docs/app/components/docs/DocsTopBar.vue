<template>
  <header class="border-b-surface bg-surface-base sticky top-0 z-40 border-b">
    <div
      class="mx-auto flex h-(--docs-header) w-full max-w-(--docs-shell) items-center gap-2 px-(--docs-gutter) sm:gap-3"
    >
      <nuxt-link to="/" class="docs-tap flex shrink-0 items-center gap-2">
        <base-icon name="carabiner" aria-hidden="true" class="size-6" />
        <span class="docs-wordmark">
          {{ appTitle }}
        </span>
        <!-- The version is reference, not navigation. On a 390 bar the search
             field needs the width more than the reader needs the number. -->
        <span
          class="rounded-component-compact-sm bg-surface-high text-surface-muted docs-code hidden px-1.5 py-0.5 sm:inline"
        >
          {{ appVersion }}
        </span>
      </nuxt-link>

      <docs-search class="ml-auto" />

      <docs-mode-toggle />

      <a
        v-if="repositoryUrl"
        :href="repositoryUrl"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`${appTitle} on GitHub`"
        class="text-surface-muted hover:text-surface hover:bg-primary-muted active:bg-primary-muted-hover rounded-component-2xs hidden size-8 shrink-0 items-center justify-center transition-colors sm:flex"
      >
        <base-icon name="brand-github" aria-hidden="true" class="size-4" />
      </a>

      <magic-drawer-trigger
        :id="navigationDrawerId"
        v-slot="{ active }"
        as-child
      >
        <button
          type="button"
          class="text-surface-muted hover:text-surface hover:bg-primary-muted active:bg-primary-muted-hover rounded-component-2xs -mr-2.5 flex size-11 shrink-0 items-center justify-center transition-colors sm:mr-0 sm:size-8"
          :class="{ 'lg:hidden': !menu }"
          :aria-expanded="active"
          aria-label="Open the menu"
          aria-controls="docs-navigation-panel"
        >
          <base-icon name="menu" aria-hidden="true" class="size-4" />
        </button>
      </magic-drawer-trigger>
    </div>

    <docs-navigation-drawer />
  </header>
</template>

<script setup lang="ts">
interface DocsTopBarProps {
  // Pages without a sidebar keep the menu at every width.
  menu?: boolean
}

const { menu = false } = defineProps<DocsTopBarProps>()

const appConfig = useAppConfig()
const appTitle = computed(() => appConfig.appTitle)
const appVersion = computed(() => appConfig.appVersion)
const repositoryUrl = computed(() => appConfig.repositoryUrl)
</script>
