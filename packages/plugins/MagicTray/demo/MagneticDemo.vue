<template>
  <div
    class="bg-surface-low text-surface-subtle relative flex aspect-16/9 w-120 max-w-full items-center justify-between rounded-[0.25rem] select-none"
  >
    <span class="w-16 text-center">L</span>
    <span class="w-16 text-center">R</span>
    <magic-tray-provider :id="id" :options="options">
      <magic-tray-content
        :style="{
          '--magic-tray-radius': '0.5rem',
          '--magic-tray-drag-overshoot-outer': '3.5rem',
        }"
      >
        <template #background>
          <div class="bg-surface-base h-full w-full" />
        </template>
        <div
          class="text-surface flex h-full w-full items-center justify-center p-8 text-center"
        >
          Move toward the left or right edge
        </div>
      </magic-tray-content>
    </magic-tray-provider>
  </div>
</template>

<script lang="ts" setup>
import { useMagicTray } from '@maas/vue-equipment/plugins/MagicTray'
import type { MagicTrayOptions } from '@maas/vue-equipment/plugins/MagicTray'

const id = 'magic-tray-magnetic-demo'

const options: MagicTrayOptions = {
  snapPoints: {
    right: [0, '196px'],
    left: [0, '196px'],
  },
  snap: { mode: 'step' },
  magnetism: {
    sides: {
      left: { 0: 'inner', '196px': 'outer' },
      right: { 0: 'inner', '196px': 'outer' },
    },
    radius: 196,
    pull: 24,
  },
  threshold: { distance: 32 },
  inset: true,
}

useMagicTray(id, options)
</script>
