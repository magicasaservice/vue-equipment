<template>
  <footer
    v-if="theme.footer && frontmatter.footer !== false"
    class="vp-footer-override relative z-50 px-6 pb-6 pt-4 md:px-8 xl:pt-6"
    :class="{ hidden: hasSidebar }"
  >
    <div
      class="type-surface-footnote text-surface-subtle justify-left flex flex-col items-center"
    >
      <div class="flex items-center gap-x-2">
        <i-maas-maas-robot-500 class="h-3 w-3" />
        <p
          v-if="theme.footer.message"
          class="message"
          v-html="theme.footer.message"
        />
      </div>
      <div class="flex flex-col items-center gap-x-2 sm:flex-row">
        <p
          v-if="theme.footer.copyright"
          class="copyright"
          v-html="theme.footer.copyright"
        />
        <div class="flex gap-2">
          <span class="hidden sm:block">•</span>
          <a
            href="https://maas.engineering/legal-notice"
            target="_blank"
            rel="noopener noreferrer"
          >
            Legal Notice
          </a>
          <span>•</span>
          <a
            href="https://maas.engineering/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          <span>•</span>
          <span>&copy; {{ currentYear }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { useSidebar } from 'vitepress/theme-without-fonts'

const { theme, frontmatter } = useData()
const { hasSidebar } = useSidebar()

const currentYear = new Date().getFullYear()
</script>

<style scoped>
.VPFooter {
  position: relative;
  z-index: var(--vp-z-index-footer);
  border-top: 1px solid var(--vp-c-gutter);
  padding: 32px 24px;
  background-color: var(--vp-c-bg);
}

.VPFooter.has-sidebar {
  display: none;
}
</style>
