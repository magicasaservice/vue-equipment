<template>
  <magic-menu-provider id="magic-menu-dropdown" :options="{ mode: 'dropdown' }">
    <magic-menu-view>
      <magic-menu-trigger as-child>
        <m-button size="xs">
          {{ menu.label }}
        </m-button>
      </magic-menu-trigger>
      <magic-menu-content>
        <div
          class="bg-surface-elevation-high w-[220px] rounded-2xl p-1 text-black"
        >
          <nested-demo-menu
            v-for="(item, itemIndex) in menu.items"
            :key="itemIndex"
            :item="item"
          />
        </div>
      </magic-menu-content>
    </magic-menu-view>
  </magic-menu-provider>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'

import NestedDemoMenu from './components/NestedDemoMenu.vue'

const menu = {
  label: 'Menu',
  type: 'button',
  items: [
    { label: 'New Tab', cmd: '⌘ T' },
    { label: 'New Window', cmd: '⌘ W' },
    { label: 'New Incognito Window', disabled: true },
    {
      label: 'Share',
      items: [
        { label: 'Email Link', disabled: true },
        { label: 'Messages' },
        { label: 'Notes' },
        {
          label: 'Socials',
          items: [{ label: 'Instagram' }, { label: 'Bluesky' }],
        },
      ],
    },
    { label: 'Print', cmd: '⌘ P' },
    { label: 'Show Bookmarks', cmd: '⇧ ⌘ B' },
    { label: 'Show Full URLs' },
    { label: 'Reload', cmd: '⌘ R' },
    { label: 'Force Reload', cmd: '⇧ ⌘ R' },
    { label: 'Fullscreen', cmd: '⌘ F' },
    { label: 'Hide Sidebar' },
  ],
}
</script>

<style>
:root {
  --magic-menu-float-arrow-color: theme(
    'backgroundColor.surface.elevation.high.DEFAULT'
  );
}
</style>
