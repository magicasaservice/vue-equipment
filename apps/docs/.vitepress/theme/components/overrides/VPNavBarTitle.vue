<template>
  <div class="vp-nav-bar-title" :class="{ 'has-sidebar': hasSidebar }">
    <a
      class="type-surface-title-sm -short -strong"
      :href="link ?? normalizeLink(currentLang.link)"
      :rel="rel"
      :target="target"
    >
      <i-maas-carabiner-500 class="h-6 w-6" />
      <span v-if="theme.siteTitle" v-html="theme.siteTitle"></span>
      <span v-else-if="theme.siteTitle === undefined">{{ site.title }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useLangs } from 'vitepress/dist/client/theme-default/composables/langs.js'
import { useSidebar } from 'vitepress/dist/client/theme-default/composables/sidebar.js'
import { normalizeLink } from 'vitepress/dist/client/theme-default/support/utils.js'

const { site, theme } = useData()
const { hasSidebar } = useSidebar()
const { currentLang } = useLangs()

const link = computed(() =>
  typeof theme.value.logoLink === 'string'
    ? theme.value.logoLink
    : theme.value.logoLink?.link
)

const rel = computed(() =>
  typeof theme.value.logoLink === 'string'
    ? undefined
    : theme.value.logoLink?.rel
)

const target = computed(() =>
  typeof theme.value.logoLink === 'string'
    ? undefined
    : theme.value.logoLink?.target
)
</script>

<style scoped>
.vp-nav-bar-title a {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  height: 4rem;
  flex-shrink: 0;
}
</style>
