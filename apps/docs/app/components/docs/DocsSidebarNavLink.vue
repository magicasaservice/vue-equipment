<template>
  <docs-menu-item
    :to="item.path"
    size="xs"
    :active="active"
    :data-nav-active="active || undefined"
  >
    {{ item.title }}

    <template v-if="badge" #cmd>
      <m-badge size="xs" mode="muted" variant="accent">{{ badge }}</m-badge>
    </template>
  </docs-menu-item>
</template>

<script setup lang="ts">
import { getFunction } from 'metadata'
import type { ContentNavigationItem } from '@nuxt/content'

interface DocsSidebarNavLinkProps {
  item: ContentNavigationItem
}

const { item } = defineProps<DocsSidebarNavLinkProps>()

// The current row is the menu item's `selected` state, so it is a prop rather
// than a router class: the recipe assembles one color per state and cannot
// have a second one appended from outside.
const route = useRoute()
const active = computed(() => normalize(route.path) === normalize(item.path))

// A plugin or composable flagged `soon` or `new` in its front matter says so
// beside its name.
const badge = computed(() => {
  const name = item.path.split('/').pop() ?? ''
  const fn = getFunction(name)
  if (fn?.soon) {
    return 'Soon'
  }
  if (fn?.new) {
    return 'New'
  }
  return undefined
})

function normalize(path: string) {
  return path.replace(/\/$/, '') || '/'
}
</script>
