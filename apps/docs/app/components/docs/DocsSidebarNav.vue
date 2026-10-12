<template>
  <nav>
    <ul class="space-y-5">
      <li v-for="section in navigation" :key="section.path">
        <template v-if="section.children?.length">
          <!-- A section label, not a disclosure. Nothing in this tree was ever
               collapsed in practice, so the chevron was state that never
               changed and a target that did nothing. -->
          <p class="docs-label pb-1 pl-3.5">{{ section.title }}</p>

          <ul class="flex flex-col gap-1">
            <li v-for="child in section.children" :key="child.path">
              <docs-sidebar-nav-link :item="child" />
            </li>
          </ul>
        </template>

        <docs-sidebar-nav-link v-else :item="section" />
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

defineProps<{
  navigation: Array<ContentNavigationItem>
}>()
</script>
