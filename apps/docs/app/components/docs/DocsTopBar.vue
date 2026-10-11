<template>
  <!-- The provider renders the bar itself. `as` rather than `as-child`,
       because a child carrying only static classes has its props object
       hoisted, and the slot primitive edits that object as it merges. -->
  <magic-accordion-provider
    :id="accordionId"
    as="header"
    class="border-b-surface bg-surface-base sticky top-0 z-40 border-b"
  >
    <magic-accordion-view :id="viewId" v-slot="{ viewActive }">
      <div
        class="mx-auto flex h-[var(--docs-header)] w-full max-w-[var(--docs-shell)] items-center gap-2 px-(--docs-gutter) sm:gap-3"
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
          class="text-surface-muted hover:text-surface hidden size-8 shrink-0 items-center justify-center transition-colors sm:flex"
        >
          <base-icon name="brand-github" aria-hidden="true" class="size-4" />
        </a>

        <magic-accordion-trigger
          type="button"
          class="text-surface-muted hover:text-surface -mr-2.5 flex size-11 shrink-0 items-center justify-center transition-colors"
          :class="{ 'lg:hidden': !menu }"
          :aria-expanded="viewActive"
          :aria-label="viewActive ? 'Close the menu' : 'Open the menu'"
          aria-controls="docs-mobile-navigation"
          @click="onToggle"
        >
          <base-icon
            :name="viewActive ? 'close' : 'menu'"
            aria-hidden="true"
            class="size-4"
          />
        </magic-accordion-trigger>
      </div>

      <magic-accordion-content :class="{ 'lg:hidden': !menu }">
        <div
          id="docs-mobile-navigation"
          ref="drawer"
          class="bg-surface-base mx-auto max-h-[70svh] w-full max-w-[var(--docs-shell)] overflow-y-auto px-(--docs-gutter) pt-1 pb-4"
        >
          <docs-sidebar-nav :navigation="navigation ?? []" />
        </div>
      </magic-accordion-content>
    </magic-accordion-view>
  </magic-accordion-provider>
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

const { data: navigation } = await useDocsNavigation()

const accordionId = 'docs-navigation'
const viewId = 'docs-navigation-drawer'

const { unselectView } = useMagicAccordion(accordionId)
const drawer = useTemplateRef('drawer')

// The drawer opens on whatever page the reader is on, so it opens showing that
// page rather than at the top of a tree they then have to scan. The accordion
// owns the open state, so what this reads is the drawer itself: no offset
// parent means it is still the closed half of the toggle.
function onToggle() {
  nextTick(() => {
    if (!drawer.value?.offsetParent) {
      return
    }
    drawer.value
      .querySelector('[data-nav-active]')
      ?.scrollIntoView({ block: 'center' })
  })
}

const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    unselectView(viewId)
  }
)
</script>
