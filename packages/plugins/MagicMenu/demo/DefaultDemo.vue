<template>
  <magic-menu-provider
    id="magic-menu-default-demo"
    class="bg-surface-high inline-flex gap-2 rounded-2xl p-1"
  >
    <magic-menu-view v-for="(menuItem, index) in menu" :key="index">
      <magic-menu-trigger v-slot="{ viewActive }" as-child>
        <m-button :mode="viewActive ? 'translucent' : 'ghost'" size="xs">
          {{ menuItem.label }}
        </m-button>
      </magic-menu-trigger>
      <magic-menu-content :middleware="offsetMiddleware">
        <div class="bg-surface-high w-[220px] rounded-2xl p-1">
          <nested-demo-menu
            v-for="(item, itemIndex) in menuItem.items"
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
import { offset } from '@floating-ui/dom'

import NestedDemoMenu from './components/NestedDemoMenu.vue'

import '@maas/vue-equipment/utils/css/keyframes/fade-in.css'
import '@maas/vue-equipment/utils/css/keyframes/fade-out.css'

const offsetMiddleware = [offset({ crossAxis: -4, mainAxis: 8 })]

const menu = [
  {
    label: 'Edit',
    type: 'button',
    items: [
      { label: 'Undo', cmd: '⌘ Z' },
      { label: 'Redo', cmd: '⇧ ⌘ Z' },
      {
        label: 'Find',
        items: [
          { label: 'Search the web…' },
          { label: 'Find…' },
          { label: 'Find Next' },
          { label: 'Find Previous' },
        ],
      },
      { label: 'Cut', cmd: '⌘ X' },
      { label: 'Copy', cmd: '⌘ C' },
      { label: 'Paste', cmd: '⌘ V' },
    ],
  },
  {
    label: 'File',
    type: 'ghost',
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
    ],
  },
  {
    label: 'View',
    type: 'ghost',
    items: [
      { label: 'Show Bookmarks', cmd: '⇧ ⌘ B' },
      { label: 'Show Full URLs' },
      { label: 'Reload', cmd: '⌘ R' },
      { label: 'Force Reload', cmd: '⇧ ⌘ R' },
      { label: 'Fullscreen', cmd: '⌘ F' },
      { label: 'Hide Sidebar' },
    ],
  },
  {
    label: 'Profiles',
    type: 'ghost',
    items: [
      {
        label: 'Christoph Jeworutzki',
        items: [
          { label: 'User Settings' },
          { label: 'Edit Profile' },
          { label: 'Subscribtions' },
        ],
      },
      {
        label: 'Robin Scholz',
        items: [
          { label: 'User Settings' },
          { label: 'Edit Profile' },
          { label: 'Subscribtions' },
        ],
      },
      { label: 'Edit…' },
      { label: 'Add Profile…' },
    ],
  },
]
</script>
