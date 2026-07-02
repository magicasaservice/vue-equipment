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
          <div
            class="text-surface flex h-full w-full items-center justify-center p-8 text-center"
          >
            Tap the left or right edge to toggle it, drag to move freely
          </div>
        </magic-tray-content>
      </magic-tray-provider>
    </div>

    <div
      class="bg-surface-low text-surface w-120 max-w-full rounded-[0.25rem] p-4 font-mono text-sm"
    >
      <div class="text-surface-subtle mb-2 text-xs tracking-widest uppercase">
        staticClick events
      </div>
      <div class="flex flex-col gap-1.5">
        <template v-if="log.length">
          <div
            v-for="(entry, i) in log"
            :key="i"
            class="flex justify-between"
            :class="i === 0 ? 'text-surface' : 'text-surface-subtle'"
          >
            <span>{{ entry.side }}</span>
            <span>{{ Math.round(entry.value) }}px</span>
          </div>
        </template>
        <span v-else class="text-surface-subtle">—</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'
import { useMagicTray } from '@maas/vue-equipment/plugins/MagicTray'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import type {
  MagicTrayOptions,
  TraySidePayload,
} from '@maas/vue-equipment/plugins/MagicTray'

const id = 'magic-tray-static-click-demo'

const options: MagicTrayOptions = {
  snapPoints: { left: [0, 0.25], right: [0, 0.25] },
  threshold: { distance: 32 },
  inset: true,
}

const { snapTo, activeSnapPoint } = useMagicTray(id, options)
const emitter = useMagicEmitter()

const log = ref<({ id: string } & TraySidePayload)[]>([])

// Toggle the tapped side between its open and closed snap points
function onStaticClick(payload: { id: string } & TraySidePayload) {
  if (payload.id !== id) {
    return
  }

  log.value.unshift(payload)
  if (log.value.length > 5) {
    log.value.length = 5
  }

  const current = activeSnapPoint.value[payload.side]
  snapTo(payload.side, current === 0 ? 1 : 0)
}

emitter.on('staticClick', onStaticClick)

onBeforeUnmount(() => {
  emitter.off('staticClick', onStaticClick)
})
</script>
