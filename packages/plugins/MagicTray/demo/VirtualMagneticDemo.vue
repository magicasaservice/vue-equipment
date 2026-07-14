<template>
  <div class="flex flex-col items-center gap-4 select-none">
    <div
      class="bg-surface-low text-surface-subtle relative flex aspect-16/9 w-120 max-w-full items-center justify-between overflow-hidden rounded-[0.25rem]"
    >
      <magic-tray-provider :id="id" :options="options">
        <magic-tray-content
          :style="{
            '--magic-tray-radius': '0.25rem',
            '--magic-tray-drag-overshoot-outer': '3.5rem',
            '--magic-tray-handle-offset-x-left': 'calc(-50% + 0.5rem)',
            '--magic-tray-handle-offset-x-right': 'calc(50% - 0.5rem)',
          }"
        >
          <template #handle-left>
            <div
              class="h-[calc(2.5rem+var(--handle-v,0)*1rem)] w-1 rounded-full bg-[#fff] opacity-[calc(0.1+var(--handle-v,0)*0.9)]"
              :style="{ '--handle-v': handleV('left') }"
            />
          </template>
          <template #handle-right>
            <div
              class="h-[calc(2.5rem+var(--handle-v,0)*1rem)] w-1 rounded-full bg-[#fff] opacity-[calc(0.1+var(--handle-v,0)*0.9)]"
              :style="{ '--handle-v': handleV('right') }"
            />
          </template>
          <template #background>
            <div class="bg-surface-base h-full w-full" />
          </template>
          <div
            class="text-surface flex h-full w-full items-center justify-center p-8 text-center"
          >
            Move toward the left or right edge<br />
            [clip stays frozen]
          </div>
        </magic-tray-content>
      </magic-tray-provider>
    </div>

    <div
      class="bg-surface-low text-surface w-120 max-w-full rounded-[0.25rem] p-4 font-mono text-sm"
    >
      <div class="text-surface-subtle mb-3 text-xs tracking-widest uppercase">
        magnet event
      </div>
      <div class="mb-1.5 flex justify-between text-xs">
        <span class="text-surface-subtle">
          left
          <span class="text-surface">{{ magnetValues.left.toFixed(3) }}</span>
        </span>
        <span class="text-surface-subtle">
          right
          <span class="text-surface">{{ magnetValues.right.toFixed(3) }}</span>
        </span>
      </div>
      <div class="bg-surface-base relative h-1 overflow-hidden rounded-full">
        <div
          class="bg-success-solid absolute right-1/2 h-full w-[calc(var(--bar-v,0)*50%)] opacity-(--bar-v,0)"
          :style="{ '--bar-v': magnetValues.left }"
        />
        <div
          class="bg-success-solid absolute left-1/2 h-full w-[calc(var(--bar-v,0)*50%)] opacity-(--bar-v,0)"
          :style="{ '--bar-v': magnetValues.right }"
        />
        <div
          class="bg-surface-subtle absolute top-0 left-1/2 h-full w-px -translate-x-1/2"
        />
      </div>

      <div
        class="text-surface-subtle mt-4 mb-3 text-xs tracking-widest uppercase"
      >
        state
      </div>
      <div class="flex flex-col gap-1.5">
        <template v-for="side in sides" :key="side">
          <div class="flex justify-between">
            <span class="text-surface-subtle">activeSnapPoint.{{ side }}</span>
            <span>{{ state.activeSnapPoint[side] ?? '—' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-surface-subtle">progress.{{ side }}</span>
            <span>{{ state.progress[side].toFixed(3) }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount } from 'vue'
import { useMagicTray } from '@maas/vue-equipment/plugins/MagicTray'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import type {
  MagicTrayOptions,
  MagicTraySide,
} from '@maas/vue-equipment/plugins/MagicTray'

const id = 'magic-tray-virtual-magnetic-demo'
const sides: MagicTraySide[] = ['left', 'right']

const options: MagicTrayOptions = {
  snapPoints: {
    left: [0, 0.25],
    right: [0, 0.25],
  },
  snap: { mode: 'step' },
  magnetism: {
    sides: {
      left: { 0: 'inner', 0.25: 'inner' },
      right: { 0: 'inner', 0.25: 'inner' },
    },
    radius: { start: 32, stop: 8 },
    virtual: true,
  },
  threshold: { distance: 32 },
  inset: true,
}

const { state } = useMagicTray(id, options)
const emitter = useMagicEmitter()

const magnetValues = reactive<Record<MagicTraySide, number>>({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
})

function handleV(side: MagicTraySide) {
  return state.draggingSide === side ? 1 : magnetValues[side]
}

function onMagnet(payload: { id: string; side: MagicTraySide; value: number }) {
  if (payload.id === id) {
    magnetValues[payload.side] = payload.value
  }
}

emitter.on('magnet', onMagnet)

onBeforeUnmount(() => {
  emitter.off('magnet', onMagnet)
})
</script>
