<template>
  <div
    class="bg-surface-low text-surface rounded-surface-lg relative aspect-[402/874] w-72 max-w-full overflow-clip select-none"
  >
    <magic-tray-trigger :id="id" side="left" as-child>
      <aside class="absolute inset-y-0 left-0 flex w-56 flex-col pt-7 pb-4">
        <div class="flex items-center justify-between px-4">
          <span class="type-surface-callout-md">Vue Equipment</span>
          <span
            class="bg-surface-base flex size-8 items-center justify-center rounded-full"
          >
            <svg v-bind="svg" class="size-4"><path :d="icons.search" /></svg>
          </span>
        </div>
        <ul class="mt-3 flex flex-col px-2">
          <li v-for="item in nav" :key="item.label">
            <button
              class="type-surface-body-sm flex w-full items-center gap-3 px-2 py-2 text-left"
            >
              <svg v-bind="svg" class="size-4 shrink-0">
                <path :d="item.icon" />
              </svg>
              {{ item.label }}
            </button>
          </li>
        </ul>
        <div class="type-surface-caption text-surface-subtle mt-4 px-4">
          Recents
        </div>
        <ul class="mt-1 flex flex-col px-2">
          <li v-for="chat in chats" :key="chat">
            <button
              class="type-surface-body-sm rounded-component-sm flex w-full items-center gap-3 px-2 py-2 text-left"
              :class="{ 'bg-surface-base': chat === selected }"
              @click="selected = chat"
            >
              <svg v-bind="svg" class="size-4 shrink-0">
                <path :d="icons.chat" />
              </svg>
              <span class="truncate">{{ chat }}</span>
            </button>
          </li>
        </ul>
        <div class="mt-auto flex items-center justify-between px-4 pt-3">
          <span
            class="bg-surface-base type-surface-caption flex size-8 items-center justify-center rounded-full"
          >
            VE
          </span>
          <m-button size="sm">New chat</m-button>
        </div>
      </aside>
    </magic-tray-trigger>
    <magic-tray-provider :id="id" :options="options">
      <magic-tray-content
        :style="{ '--magic-tray-radius': 'var(--radius-surface-lg)' }"
      >
        <template #background>
          <div class="bg-surface-base h-full w-full" />
        </template>
        <magic-tray-transform axis="x" class="h-full">
          <magic-tray-trigger side="left" as-child>
            <div class="flex h-full w-full flex-col">
              <header class="flex items-center gap-3 px-4 pt-6 pb-3">
                <button
                  class="bg-surface-high flex size-8 shrink-0 items-center justify-center rounded-full"
                  @click="snapTo('left', '224px')"
                >
                  <svg v-bind="svg" class="size-4">
                    <path :d="icons.menu" />
                  </svg>
                </button>
                <span class="type-surface-callout-md truncate">{{
                  selected
                }}</span>
              </header>
              <div
                class="type-surface-body-sm flex flex-1 flex-col justify-end gap-3 px-5 pb-3"
              >
                <p
                  class="bg-surface-high rounded-component-xl max-w-[85%] self-end px-3.5 py-2"
                >
                  How do I close the sidebar?
                </p>
                <p class="text-surface-muted">
                  Drag it to the left. Drag this view or tap the menu to open it
                  again.
                </p>
              </div>
              <div class="px-4 pb-4">
                <div
                  class="bg-surface-high text-surface-muted type-surface-body-sm flex items-center gap-2 rounded-full px-4 py-2.5"
                >
                  <svg v-bind="svg" class="size-4">
                    <path :d="icons.plus" />
                  </svg>
                  Ask anything
                </div>
              </div>
            </div>
          </magic-tray-trigger>
        </magic-tray-transform>
      </magic-tray-content>
    </magic-tray-provider>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useMagicTray } from '@maas/vue-equipment/plugins/MagicTray'

import type { MagicTrayOptions } from '@maas/vue-equipment/plugins/MagicTray'

const id = 'magic-tray-trigger-demo'

const svg = {
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '1.5',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
}

const icons = {
  search: 'M10.5 10.5 13.5 13.5M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z',
  menu: 'M3 5h10M3 8h10M3 11h10',
  plus: 'M8 3v10M3 8h10',
  folder:
    'M2 4.5A1.5 1.5 0 0 1 3.5 3h3L8 4.5h4.5A1.5 1.5 0 0 1 14 6v5.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5z',
  code: 'm5.5 4.5-3.5 3.5 3.5 3.5M10.5 4.5 14 8l-3.5 3.5',
  clock: 'M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12ZM8 5v3l2.5 1.5',
  chat: 'M3 4.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5v5a1.5 1.5 0 0 1-1.5 1.5H7l-3 2.5V11h-.5A1.5 1.5 0 0 1 3 9.5z',
}

const nav = [
  { label: 'Projects', icon: icons.folder },
  { label: 'Code', icon: icons.code },
  { label: 'Scheduled', icon: icons.clock },
]

const chats = [
  'Closing the sidebar',
  'Plan a weekend in Lisbon',
  'Explain clip-path insets',
  'Sourdough starter schedule',
  'Rename these variables',
  'Draft a release note',
]

const selected = ref('Closing the sidebar')

const options: MagicTrayOptions = {
  snapPoints: { left: [0, '224px'] },
  initial: { snapPoints: { left: '224px' } },
  threshold: { distance: 32 },
  handles: false,
  inset: true,
}

const { snapTo } = useMagicTray(id, options)
</script>
