<template>
  <!-- Below the width the contents rail needs, the same links sit folded at
       the top of the page, where the old inline overview used to be. -->
  <magic-accordion-provider
    v-if="links.length"
    :id="accordionId"
    as="nav"
    aria-label="On this page"
    class="rounded-component-sm bg-surface-high mb-8 min-[1200px]:hidden"
  >
    <magic-accordion-view id="contents" v-slot="{ viewActive }">
      <magic-accordion-trigger
        type="button"
        class="docs-label flex h-11 w-full items-center justify-between px-4"
        :aria-expanded="viewActive"
        :aria-controls="`${accordionId}-links`"
      >
        On this page
        <base-icon
          name="chevron-s"
          aria-hidden="true"
          class="size-3.5 transition-transform"
          :class="{ 'rotate-180': viewActive }"
        />
      </magic-accordion-trigger>

      <magic-accordion-content>
        <ul :id="`${accordionId}-links`" class="docs-rail px-4 pb-3">
          <li v-for="link in links" :key="link.id">
            <a :href="`#${link.id}`" class="docs-nav-item truncate">
              {{ link.text }}
            </a>

            <ul v-if="link.children?.length" class="pl-3">
              <li v-for="child in link.children" :key="child.id">
                <a :href="`#${child.id}`" class="docs-nav-item truncate">
                  {{ child.text }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </magic-accordion-content>
    </magic-accordion-view>
  </magic-accordion-provider>
</template>

<script setup lang="ts">
import type { TocLink } from '@nuxt/content'

interface DocsTocInlineProps {
  links: Array<TocLink>
}

const { links } = defineProps<DocsTocInlineProps>()

const accordionId = `docs-toc-${useId()}`
</script>
