<template>
  <div
    class="bg-surface-low text-surface-subtle relative flex aspect-16/9 w-120 max-w-full items-center justify-between overflow-hidden rounded-[0.25rem] select-none"
  >
    <span class="w-16 text-center">L</span>
    <span class="w-16 text-center">R</span>
    <magic-tray-provider :id="id" :options="options">
      <magic-tray-content
        :style="{
          '--magic-tray-radius': '0.5rem',
          '--magic-tray-drag-overshoot-outer': '3.5rem',
          '--magic-tray-handle-width-y': '256px',
        }"
      >
        <template #background>
          <div class="bg-surface-base h-full w-full" />
        </template>
        <div
          class="text-surface flex h-full w-full items-center justify-center p-8 text-center"
        >
          Move toward the right edge
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
    right: [0, 0.5, 1],
  },
  snap: { mode: 'step' },
  magnetism: {
    sides: {
      right: { 0: 'inner', 0.5: 'both', 1: 'outer' },
    },
  },
  threshold: { distance: 24 },
  inset: true,
}

useMagicTray(id, options)
</script>
