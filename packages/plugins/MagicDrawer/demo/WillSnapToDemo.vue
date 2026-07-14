<template>
  <div class="flex flex-col items-center gap-4 select-none">
    <m-button @click="drawerApi.open">Open Drawer</m-button>

    <div
      class="bg-surface-low text-surface w-120 max-w-full rounded-[0.25rem] p-4 font-mono text-sm"
    >
      <div class="text-surface-subtle mb-3 text-xs tracking-widest uppercase">
        snap points
      </div>
      <div class="mb-4 flex justify-between">
        <div
          v-for="point in snapPoints"
          :key="String(point)"
          class="flex flex-col items-center gap-2"
        >
          <div class="h-2 w-2 rounded-full" :class="dotClass(point)" />
          <span class="text-surface-subtle text-xs">{{ point }}</span>
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
            :class="i === 0 ? 'text-surface' : 'text-surface-subtle'"
          >
            {{ entry.snapPoint }}
          </div>
        </template>
        <span v-else class="text-surface-subtle">—</span>
      </div>
    </div>

    <magic-drawer
      id="magic-drawer-will-snap-to-demo"
      :options="{
        focusTrap: false,
        snapPoints,
        threshold: { distance: 32 },
        initial: { snapPoint: snapPoints[0] },
      }"
    >
      <div class="bg-surface-base absolute inset-0" />
    </magic-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'
import { MButton } from '@maas/mirror/vue'
import { useMagicDrawer } from '@maas/vue-equipment/plugins/MagicDrawer'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import type {
  DrawerSnapPoint,
  DrawerWillSnapToPayload,
} from '@maas/vue-equipment/plugins/MagicDrawer'

const id = 'magic-drawer-will-snap-to-demo'
const snapPoints: DrawerSnapPoint[] = [0.25, 0.5, 0.75, 1]

const drawerApi = useMagicDrawer(id)
const emitter = useMagicEmitter()

// The pending snap target during drag — null when not dragging
const willSnapTo = ref<DrawerSnapPoint | null>(null)
// The snap point the drawer has settled on
const settledSnapPoint = ref<DrawerSnapPoint>(snapPoints[0]!)

function dotClass(point: DrawerSnapPoint) {
  if (willSnapTo.value === point) {
    return 'bg-warning-solid'
  }
  if (settledSnapPoint.value === point) {
    return 'bg-success-solid'
  }
  return 'bg-surface-base'
}

const log = ref<DrawerWillSnapToPayload[]>([])

function onWillSnapTo(payload: DrawerWillSnapToPayload) {
  if (payload.id !== id) {
    return
  }
  willSnapTo.value = payload.snapPoint
  log.value.unshift(payload)
  if (log.value.length > 5) {
    log.value.length = 5
  }
}

function isDrawerSnapPoint(v: unknown): v is DrawerSnapPoint {
  return typeof v === 'number' || typeof v === 'string'
}

function onAfterSnap(payload: { id: string; snapPoint: unknown }) {
  if (payload.id !== id) {
    return
  }
  if (isDrawerSnapPoint(payload.snapPoint)) {
    settledSnapPoint.value = payload.snapPoint
  }
  willSnapTo.value = null
}

emitter.on('willSnapTo', onWillSnapTo)
emitter.on('afterSnap', onAfterSnap)

onBeforeUnmount(() => {
  emitter.off('willSnapTo', onWillSnapTo)
  emitter.off('afterSnap', onAfterSnap)
})
</script>

<style>
[data-id='magic-drawer-will-snap-to-demo'] {
  --magic-drawer-height: 100svh;
}
</style>
