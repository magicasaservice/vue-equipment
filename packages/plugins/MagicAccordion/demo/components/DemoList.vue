<template>
  <magic-accordion-view class="flex flex-col w-full">
    <magic-accordion-trigger v-slot="{ viewActive }">
      <m-menu-item size="sm" mode="plain" :active="viewActive">
        <m-menu-item-child>
          <span>{{ headline }}</span>
        </m-menu-item-child>
      </m-menu-item>
    </magic-accordion-trigger>
    <magic-accordion-content>
      <ul class="flex flex-col list-none !m-0 !p-0">
        <li v-for="item in list" :key="item.label" class="!m-0 !p-0">
          <a :href="item.url" target="_blank" rel="noopener noreferrer">
            <m-menu-item size="sm" mode="subtle">
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
      variant: 'info' | 'primary'
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
  @apply block border-surface mx-auto my-2 border-b-2;
}
</style>
