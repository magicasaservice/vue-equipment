<template>
  <div class="flex items-start">
    <article class="max-w-(--docs-measure) min-w-0 flex-1 py-12 lg:py-16">
      <template v-if="page">
        <docs-toc-inline :links="tocLinks" />
        <content-renderer :value="page" />
        <docs-pagination class="mt-16" />
      </template>

      <template v-else>
        <docs-header
          title="Page not found"
          description="This path does not exist in the documentation. The sidebar has everything that does."
        />
        <nuxt-link to="/" class="docs-link docs-body">
          Start at the beginning
        </nuxt-link>
      </template>
    </article>

    <docs-toc :links="tocLinks" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// `/plugins/MagicDrawer/` and `/plugins/MagicDrawer` are the same page, and
// both have been linked to.
const path = computed(() => route.path.replace(/\/+$/, '') || '/')

const { data: page } = await useAsyncData(
  () => path.value,
  () => queryCollection('docs').path(path.value).first()
)

const tocLinks = computed(() => page.value?.body?.toc?.links ?? [])

// A path with no content behind it is a 404, not a 200 that happens to show a
// 404 template. Crawlers and link checkers read the status, not the markup.
const event = useRequestEvent()
if (!page.value && event) {
  setResponseStatus(event, 404)
}

const { appTitleSuffix, appDescription, appUrl } = useAppConfig()
const canonicalUrl = computed(() =>
  page.value ? `${appUrl}${page.value.path}` : undefined
)

useSeoMeta({
  title: () => page.value?.title ?? 'Not found',
  description: () => page.value?.description || appDescription,
  ogTitle: () =>
    page.value
      ? `${page.value.title} | ${appTitleSuffix}`
      : `Not found | ${appTitleSuffix}`,
  ogDescription: () => page.value?.description || appDescription,
  ogUrl: canonicalUrl,
})

useHead({
  link: () =>
    canonicalUrl.value ? [{ rel: 'canonical', href: canonicalUrl.value }] : [],
})
</script>
