<template>
  <div class="flex flex-col items-center gap-4 select-none">
    <div
      class="bg-surface-low text-surface-subtle relative flex aspect-16/9 w-120 max-w-full items-center justify-between overflow-hidden rounded-[0.25rem]"
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
            Drag the left or right edge
          </div>
        </magic-tray-content>
      </magic-tray-provider>
    </div>

    <div
      class="bg-surface-low text-surface w-120 max-w-full rounded-[0.25rem] p-4 font-mono text-sm"
    >
      <div class="text-surface-subtle mb-3 text-xs tracking-widest uppercase">
        snap points
      </div>
      <div class="mb-4 flex flex-col gap-3">
        <div
          v-for="side in ['left', 'right']"
          :key="side"
          class="flex items-center gap-3"
        >
          <span class="text-surface-subtle w-8 text-xs">{{ side }}</span>
          <div class="flex flex-1 justify-between">
            <div
              v-for="point in side === 'right'
                ? [...snapPointKeys].reverse()
                : snapPointKeys"
              :key="point"
              class="flex flex-col items-center gap-2"
            >
              <div
                class="h-2 w-2 rounded-full"
                :class="dotClass(side, point)"
              />
              <span class="text-surface-subtle text-xs">{{ point }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="text-surface-subtle mb-2 text-xs tracking-widest uppercase">
        willSnapTo events
      </div>
      <div class="flex flex-col gap-1.5">
        <template v-if="log.length">
          <div
            v-for="(entry, i) in log"
            :key="i"
            class="flex justify-between"
            :class="i === 0 ? 'text-surface' : 'text-surface-subtle'"
          >
            <span>
              <span class="opacity-50">{{ entry.side }}</span>
              {{ entry.snapPoint }}
            </span>
            <span>{{ directionArrow(entry.side, entry.snapPoint) }}</span>
          </div>
        </template>
        <span v-else class="text-surface-subtle">—</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeUnmount } from 'vue'
import { useMagicTray } from '@maas/vue-equipment/plugins/MagicTray'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import type {
  MagicTrayOptions,
  TraySnapPoint,
  TraySnapPointPayload,
  TrayWillSnapToPayload,
} from '@maas/vue-equipment/plugins/MagicTray'

const id = 'magic-tray-will-snap-to-demo'
const snapPointKeys = [0, 0.25, 0.5, 0.75, 1]

const options: MagicTrayOptions = {
  snapPoints: {
    left: snapPointKeys,
    right: snapPointKeys,
  },
  threshold: { distance: 32 },
  inset: true,
}

const { activeSnapPoint } = useMagicTray(id, options)

const emitter = useMagicEmitter()

// The pending snap target per side during drag — null when not dragging
const willSnapTo = reactive<Record<string, TraySnapPoint | null>>({
  left: null,
  right: null,
})

function dotClass(side: string, point: number) {
  if (willSnapTo[side] === point) {
    return 'bg-warning-solid'
  }
  if (
    (activeSnapPoint.value as Record<string, TraySnapPoint | undefined>)[
      side
    ] === point
  ) {
    return 'bg-success-solid'
  }
  return 'bg-surface-base'
}

// Arrow reflects the spatial direction on screen
function directionArrow(side: string, snapPoint: TraySnapPoint) {
  const p = Number(snapPoint)
  return side === 'right' ? (p === 0 ? '→' : '←') : p === 0 ? '←' : '→'
}

const log = ref<TrayWillSnapToPayload[]>([])

function onWillSnapTo(payload: TrayWillSnapToPayload) {
  if (payload.id !== id) {
    return
  }
  willSnapTo[payload.side] = payload.snapPoint
  log.value.unshift(payload)
  if (log.value.length > 5) {
    log.value.length = 5
  }
}

function isTraySnapPointPayload(v: unknown): v is TraySnapPointPayload {
  return typeof v === 'object' && v !== null && 'side' in v && 'point' in v
}

function onAfterSnap(payload: { id: string; snapPoint: unknown }) {
  if (payload.id !== id) {
    return
  }
  if (isTraySnapPointPayload(payload.snapPoint)) {
    willSnapTo[payload.snapPoint.side] = null
  }
}

emitter.on('willSnapTo', onWillSnapTo)
emitter.on('afterSnap', onAfterSnap)

onBeforeUnmount(() => {
  emitter.off('willSnapTo', onWillSnapTo)
  emitter.off('afterSnap', onAfterSnap)
})
</script>
