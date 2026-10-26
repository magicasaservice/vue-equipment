<template>
  <div
    class="bg-surface-low text-surface-muted relative aspect-16/9 w-120 max-w-full overflow-hidden rounded-[0.5rem] select-none"
  >
    <magic-tray-trigger :id="id" side="left" as-child>
      <ul class="absolute inset-y-0 left-0 flex w-40 flex-col gap-1 p-4">
        <li v-for="item in items" :key="item">
          <button
            class="w-full px-2 py-1.5 text-left"
            :class="item === selected ? 'text-surface' : 'text-surface-muted'"
            @click="selected = item"
          >
            {{ item }}
          </button>
        </li>
      </ul>
    </magic-tray-trigger>
    <magic-tray-provider :id="id" :options="options">
      <magic-tray-content
        :style="{
          '--magic-tray-radius': '0.5rem',
          '--magic-tray-handle-offset-x-left': '0%',
        }"
      >
        <template #background>
          <div class="bg-surface-base h-full w-full" />
        </template>
        <div
          class="text-surface flex h-full w-full flex-col items-center justify-center gap-1 p-8 text-center"
        >
          <span>{{ selected }}</span>
          <span class="text-surface-muted">Drag the list to close it</span>
        </div>
      </magic-tray-content>
    </magic-tray-provider>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useMagicTray } from '@maas/vue-equipment/plugins/MagicTray'

import type { MagicTrayOptions } from '@maas/vue-equipment/plugins/MagicTray'

const id = 'magic-tray-trigger-demo'
const items = ['Inbox', 'Drafts', 'Sent', 'Archive']
const selected = ref(items[0])

const options: MagicTrayOptions = {
  snapPoints: { left: [0, '160px'] },
  initial: { snapPoints: { left: '160px' } },
  threshold: { distance: 32 },
  inset: true,
}

useMagicTray(id, options)
</script>
