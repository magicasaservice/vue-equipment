<template>
  <div
    class="bg-surface-low text-surface-subtle relative flex aspect-16/9 w-120 max-w-full items-center justify-between rounded-[0.25rem] select-none"
  >
    <span class="w-16 text-center">L</span>
    <span class="w-16 text-center">R</span>
    <magic-tray-provider :id="id" :options="options">
      <magic-tray-content
        :style="{
          '--magic-tray-radius': radius,
          '--magic-tray-drag-overshoot-outer': '3.5rem',
        }"
      >
        <template #background>
          <div class="bg-surface-base h-full w-full" />
        </template>
        <div
          class="text-surface flex h-full w-full items-center justify-center p-8 text-center"
        >
          Drag left or right edge
        </div>
      </magic-tray-content>
    </magic-tray-provider>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useMagicTray } from '@maas/vue-equipment/plugins/MagicTray'
import type {
  MagicTrayOptions,
  TraySide,
} from '@maas/vue-equipment/plugins/MagicTray'

const id = 'magic-tray-reveal-demo'
const sides: TraySide[] = ['top', 'right', 'bottom', 'left']

const options: MagicTrayOptions = {
  snapPoints: {
    top: ['8px'],
    right: ['64px', '128px'],
    bottom: ['8px'],
    left: ['64px', '128px'],
  },
  initial: {
    snapPoints: { top: '8px', right: '64px', bottom: '8px', left: '64px' },
    transition: true,
  },
  threshold: { distance: 32 },
  inset: true,
}

const { state } = useMagicTray(id, options)

// Roundedness tracks the first 8px of clip, maxing out at 0.5rem
const radius = computed(() => {
  const clip = (side: TraySide) =>
    Math.max(0, state.dragged[side] - state.overshoot.outer[side])
  const peek = Math.max(...sides.map(clip))
  return `${Math.min(1, peek / 8) * 0.5}rem`
})
</script>
