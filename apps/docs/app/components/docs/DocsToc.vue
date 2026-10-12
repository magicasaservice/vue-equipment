<template>
  <aside
    v-if="links.length"
    ref="rail"
    aria-label="On this page"
    class="docs-rail sticky top-(--docs-header) hidden h-[calc(100svh-var(--docs-header))] w-(--docs-toc) shrink-0 scrollbar-none overflow-y-auto py-6 pl-8 min-[1200px]:block"
  >
    <p class="docs-label px-2 pb-1">On this page</p>

    <ul>
      <li>
        <a
          href="#docs-content"
          class="docs-nav-item truncate"
          :class="activeId ? '' : 'text-surface font-medium'"
          :data-toc-active="!activeId || undefined"
        >
          Top
        </a>
      </li>

      <li v-for="link in links" :key="link.id">
        <a
          :href="`#${link.id}`"
          class="docs-nav-item truncate"
          :class="activeId === link.id ? 'text-surface font-medium' : ''"
          :data-toc-active="activeId === link.id || undefined"
        >
          {{ link.text }}
        </a>

        <ul v-if="link.children?.length" class="pl-3">
          <li v-for="child in link.children" :key="child.id">
            <a
              :href="`#${child.id}`"
              class="docs-nav-item truncate"
              :class="activeId === child.id ? 'text-surface font-medium' : ''"
              :data-toc-active="activeId === child.id || undefined"
            >
              {{ child.text }}
            </a>
          </li>
        </ul>
      </li>
    </ul>

    <docs-sponsors size="sm" class="mt-10" />
  </aside>
</template>

<script setup lang="ts">
import type { TocLink } from '@nuxt/content'

const props = defineProps<{
  links: Array<TocLink>
}>()

const ids = computed(() =>
  props.links.flatMap(({ id, children = [] }) => [
    id,
    ...children.map((child) => child.id),
  ])
)

const activeId = ref<string>()

// The active heading is the last one scrolled past the header, so exactly one
// entry is highlighted at any scroll position. Above the first heading nothing
// is highlighted and "Top" takes the mark instead.
function updateActiveId() {
  const root = getComputedStyle(document.documentElement)
  const rootSize = Number.parseFloat(root.fontSize) || 16
  const header =
    Number.parseFloat(root.getPropertyValue('--docs-header')) || 3.5
  const offset = (header + 2) * rootSize

  const elements = ids.value
    .map((id) => document.getElementById(id))
    .filter((element): element is HTMLElement => element !== null)

  let current: string | undefined
  for (const element of elements) {
    if (element.getBoundingClientRect().top - offset <= 0) {
      current = element.id
    } else {
      break
    }
  }

  activeId.value = current
}

/**
 * The rail follows the reader. Once the highlighted entry leaves the rail, the
 * rail scrolls to bring it back to its middle. Only the rail moves:
 * `scrollIntoView` would scroll the page under the reader as well.
 */
const rail = useTemplateRef('rail')
const railMargin = 32

function revealActiveId() {
  const element = rail.value
  const item = element?.querySelector<HTMLElement>('[data-toc-active]')
  if (!element || !item) {
    return
  }

  const top = item.offsetTop
  const bottom = top + item.offsetHeight
  const visible =
    top >= element.scrollTop + railMargin &&
    bottom <= element.scrollTop + element.clientHeight - railMargin
  if (visible) {
    return
  }

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches
  element.scrollTo({
    top: top - (element.clientHeight - item.offsetHeight) / 2,
    behavior: reduceMotion ? 'auto' : 'smooth',
  })
}

watch(activeId, () => nextTick(revealActiveId))

onMounted(() => {
  updateActiveId()
  window.addEventListener('scroll', updateActiveId, { passive: true })
  window.addEventListener('resize', updateActiveId, { passive: true })
  watch(ids, () => nextTick(updateActiveId))
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveId)
  window.removeEventListener('resize', updateActiveId)
})
</script>
