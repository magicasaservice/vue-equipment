<template>
  <div class="flex items-start">
    <article
      class="mx-auto max-w-(--docs-measure) min-w-0 flex-1 py-12 lg:mx-0 lg:py-16"
    >
      <template v-if="content">
        <docs-toc-inline :links="tocLinks" />
        <content-renderer
          :value="content"
          :components="{ 'docs-page-actions': DocsPageActions }"
        />
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
import { DocsPageActions } from '#components'

const route = useRoute()

// `/plugins/MagicDrawer/` and `/plugins/MagicDrawer` are the same page, and
// both have been linked to.
const path = computed(() => route.path.replace(/\/+$/, '') || '/')

const { data: page } = await useAsyncData(
  () => path.value,
  () => queryCollection('docs').path(path.value).first()
)

const tocLinks = computed(() => page.value?.body?.toc?.links ?? [])

// Nuxt Content types the body as an MDC tree, but hands it over as minimark:
// a list of `[tag, props, ...children]` tuples, with text as bare strings.
type MinimarkNode =
  [string, Record<string, unknown>, ...Array<unknown>] | string

function tagOf(node: MinimarkNode | undefined) {
  return Array.isArray(node) ? node[0] : undefined
}

// The h1 and the lede under it are the markdown’s own first nodes, so the
// page’s actions are spliced into the body after them rather than rendered
// around it.
const content = computed(() => {
  if (!page.value?.sourcePath) {
    return page.value
  }

  const body = page.value.body as unknown as { value: Array<MinimarkNode> }
  const nodes = body.value
  const index = tagOf(nodes[0]) === 'h1' ? (tagOf(nodes[1]) === 'p' ? 2 : 1) : 0
  const actions: MinimarkNode = [
    'docs-page-actions',
    { source: page.value.sourcePath, path: page.value.path },
  ]

  return {
    ...page.value,
    body: {
      ...body,
      value: [...nodes.slice(0, index), actions, ...nodes.slice(index)],
    },
  }
})

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
