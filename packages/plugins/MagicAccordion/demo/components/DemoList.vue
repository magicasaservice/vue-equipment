<template>
  <magic-accordion-view class="flex w-full flex-col">
    <magic-accordion-trigger v-slot="{ viewActive }">
      <m-menu-item size="sm" mode="ghost" :selected="viewActive">
        <m-menu-item-child>
          <span>{{ headline }}</span>
        </m-menu-item-child>
      </m-menu-item>
    </magic-accordion-trigger>
    <magic-accordion-content>
      <ul class="m-0! flex list-none flex-col p-0! pt-2!">
        <li v-for="item in list" :key="item.label" class="m-0 p-0">
          <a :href="item.url" target="_blank" rel="noopener noreferrer">
            <m-menu-item size="sm" mode="ghost">
              <m-menu-item-child class="w-full">
                <span>{{ item.label }}</span>
                <template v-if="item.badge" #end>
                  <m-badge
                    size="sm"
                    :mode="item.badge.mode"
                    :variant="item.badge.variant"
                  >
                    {{ item.badge.name }}
                  </m-badge>
                </template>
              </m-menu-item-child>
            </m-menu-item>
          </a>
        </li>
      </ul>
    </magic-accordion-content>
  </magic-accordion-view>
</template>

<script lang="ts" setup>
import { MMenuItem, MMenuItemChild, MBadge } from '@maas/mirror/vue'

export interface DemoListProps {
  headline: string
  list: {
    url: string
    label: string
    badge?: {
      name: string
      variant: 'primary' | 'accent'
      mode: 'translucent' | 'outline'
    }
    icon?: string
  }[]
}

defineProps<DemoListProps>()
</script>

<style scoped>
.magic-accordion-view:not(:last-child):after {
  content: '';
  width: calc(100% - 2.25rem);
  margin: 0.5rem auto;
  display: block;
  border-bottom: 2px solid var(--app-color-surface-border);
}
</style>
