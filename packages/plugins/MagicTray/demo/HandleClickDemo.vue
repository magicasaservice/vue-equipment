<template>
  <div class="flex flex-col items-center gap-4 select-none">
    <div
      class="bg-surface-low text-surface-subtle relative flex aspect-16/9 w-120 max-w-full items-center justify-between overflow-hidden rounded-[0.25rem]"
    >
      <span class="w-16 text-center">L</span>
      <span class="w-16 text-center">R</span>
      <magic-tray-provider :id="id" :options="options">
        <magic-tray-content :style="{ '--magic-tray-radius': '0.5rem' }">
          <template #background>
            <div class="bg-surface-base h-full w-full" />
          </template>
          <template #handle="{ side }">
            <button class="bg-surface h-full w-full" @click="toggle(side)" />
          </template>
          <div
            class="text-surface flex h-full w-full items-center justify-center p-8 text-center"
          >
            Click a handle button to toggle <br />
            or drag to move freely
          </div>
        </magic-tray-content>
      </magic-tray-provider>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMagicTray } from '@maas/vue-equipment/plugins/MagicTray'
import type {
  MagicTrayOptions,
  MagicTraySide,
} from '@maas/vue-equipment/plugins/MagicTray'

const id = 'magic-tray-handle-click-demo'

const options: MagicTrayOptions = {
  snapPoints: { left: [0, 0.25], right: [0, 0.25] },
  threshold: { distance: 32 },
  inset: true,
}

const { snapTo, activeSnapPoint } = useMagicTray(id, options)

// Toggle the side between its open and closed snap points on a genuine tap.
// A drag suppresses the click, so the handle still moves freely.
function toggle(side: MagicTraySide) {
  const current = activeSnapPoint.value[side]
  snapTo(side, current === 0 ? 0.25 : 0)
}
</script>
