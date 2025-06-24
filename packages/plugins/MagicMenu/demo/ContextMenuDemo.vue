<template>
  <magic-menu-provider
    id="magic-menu-context"
    :options="{ mode: 'context' }"
    class="w-full"
  >
    <magic-menu-view>
      <magic-menu-trigger
        class="border-surface flex h-36 w-full items-center justify-center rounded-lg border-2 border-dashed"
      >
        <span class="type-control-text-sm text-surface-subtle">
          Right Click
        </span>
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
