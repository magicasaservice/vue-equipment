<template>
  <div class="bg-surface-base text-surface min-h-svh">
    <a
      href="#docs-content"
      class="rounded-component-2xs bg-surface-high text-surface docs-body-sm sr-only px-3 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
    >
      Skip to content
    </a>

    <docs-top-bar :menu="!hasSidebar" />

    <div
      class="mx-auto flex w-full max-w-[var(--docs-shell)] items-start px-(--docs-gutter)"
    >
      <docs-sidebar v-if="hasSidebar" />
      <main
        id="docs-content"
        class="min-w-0 flex-1"
        :class="{ 'lg:pl-12': hasSidebar }"
      >
        <nuxt-page />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { appTitle, appTitleSuffix, appDescription, appUrl, appImageAlt } =
  useAppConfig()

const route = useRoute()
const hasSidebar = computed(() => route.meta.sidebar !== false)

useHead({
  titleTemplate: (title) =>
    title ? `${title} | ${appTitleSuffix}` : appTitleSuffix,
})

useSeoMeta({
  description: appDescription,
  ogSiteName: appTitle,
  ogType: 'website',
  ogImage: `${appUrl}/images/og-image.jpg`,
  ogImageType: 'image/jpeg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: appImageAlt,
  twitterCard: 'summary_large_image',
})
</script>
