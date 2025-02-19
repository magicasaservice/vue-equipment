<template>
  <div class="w-full">
    <m-button size="xs" square icon mode="translucent" @click="open">
      <i-maas-menu-500 />
    </m-button>
    <magic-drawer :id="DrawerId.navMenuDrawer" :options="{ focusTrap: false }">
      <div
        class="bg-surface-elevation-base scrollbar-none rounded-t-surface-sm flex w-full flex-col gap-12 overflow-auto px-3 py-6"
      >
        <div class="flex flex-col gap-8">
          <drawer-handle />
          <magic-accordion-provider
            :id="AccordionId.navMenuDrawer"
            class="w-full"
          >
            <magic-accordion-view
              class="flex w-full flex-col"
              v-for="entry in theme.sidebar"
            >
              <magic-accordion-trigger v-slot="{ viewActive }">
                <m-menu-item size="sm" mode="plain" :active="viewActive">
                  <m-menu-item-child>
                    <span>{{ entry.text }}</span>
                  </m-menu-item-child>
                  <template #end>
                    <m-menu-item-child end>
                      <i-maas-chevron-s-500 v-if="!viewActive" />
                      <i-maas-chevron-n-500 v-if="viewActive" />
                    </m-menu-item-child>
                  </template>
                </m-menu-item>
              </magic-accordion-trigger>
              <magic-accordion-content>
                <ul class="!m-0 flex list-none flex-col !p-0">
                  <li
                    v-for="item in entry.items"
                    :key="item.text"
                    class="!m-0 !p-0"
                  >
                    <VPLink :href="item.link">
                      <m-menu-item size="sm" mode="subtle">
                        <m-menu-item-child class="w-full">
                          <span>{{ item.text }}</span>
                        </m-menu-item-child>
                      </m-menu-item>
                    </VPLink>
                  </li>
                </ul>
              </magic-accordion-content>
            </magic-accordion-view>
          </magic-accordion-provider>
        </div>

        <div
          class="type-surface-footnote text-surface-subtle mt-auto flex items-center justify-between px-4 pb-[var(--magic-drawer-drag-overshoot)]"
        >
          <p class="flex flex-col">
            <span>Designed and Engineered by</span>
            <span>Magic as a Service™</span>
          </p>
          <i-maas-maas-robot-sticker-500 class="h-6 w-6" />
        </div>
      </div>
    </magic-drawer>
  </div>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress'
import { useMagicDrawer } from '@maas/vue-equipment/plugins'
import { DrawerId, AccordionId } from '../utils/enums'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import DrawerHandle from './DrawerHandle.vue'

const { open } = useMagicDrawer(DrawerId.navMenuDrawer)

const { theme } = useData()
</script>

<style>
[data-id='magic-drawer--nav-menu-drawer'] {
  --magic-drawer-height: auto;
  --magic-drawer-max-height: calc(100dvh - 4rem);
}

[data-id='magic-drawer--nav-menu-drawer']
  .magic-accordion-view:not(:last-child):after {
  content: '';
  width: calc(100% - 1.5rem);
  @apply border-surface mx-auto my-2 block border-b-2;
}
</style>
