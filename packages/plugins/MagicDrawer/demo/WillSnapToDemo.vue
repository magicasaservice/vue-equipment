<template>
  <m-button @click="drawerApi.open">Open Drawer</m-button>

  <magic-drawer
    id="magic-drawer-will-snap-to-demo"
    :options="{
      focusTrap: false,
      snapPoints,
      threshold: { distance: 32 },
      initial: { snapPoint: snapPoints[0] },
    }"
  >
    <div class="bg-surface-base absolute inset-0 select-none">
      <div class="flex justify-center p-4">
        <div
          class="bg-surface-high text-surface w-120 max-w-full rounded-[0.5rem] p-4 font-mono text-sm"
        >
          <div class="mb-4 flex justify-between text-xs">
            <span class="text-surface-muted tracking-widest uppercase">
              snap points
            </span>
            <span
              :class="
                willSnapTo !== null
                  ? 'text-warning-solid'
                  : 'text-success-solid'
              "
            >
              {{ status }}
            </span>
          </div>
          <div class="relative flex justify-between">
            <div class="border-surface absolute inset-x-5 top-1.25 border-t" />
            <div
              v-for="point in snapPoints"
              :key="String(point)"
              class="relative flex w-10 flex-col items-center gap-2"
            >
              <div
                class="h-2.5 w-2.5 rounded-full transition-colors"
                :class="dotClass(point)"
              />
              <span class="text-surface-muted text-xs">{{ point }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </magic-drawer>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { MButton } from 'mirror-compat'
import { useMagicDrawer } from '@maas/vue-equipment/plugins/MagicDrawer'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'

import type { MagicEmitterEvents } from '@maas/vue-equipment/plugins/MagicEmitter'
import type {
  MagicDrawerSnapPoint,
  MagicDrawerWillSnapToPayload,
} from '@maas/vue-equipment/plugins/MagicDrawer'

const id = 'magic-drawer-will-snap-to-demo'
const snapPoints: MagicDrawerSnapPoint[] = [0.25, 0.5, 0.75, 1]

const drawerApi = useMagicDrawer(id)
const emitter = useMagicEmitter()

// The pending snap target during drag — null when not dragging
const willSnapTo = ref<MagicDrawerSnapPoint | null>(null)

const status = computed(() =>
  willSnapTo.value !== null
    ? `will snap to ${willSnapTo.value}`
    : `snapped to ${drawerApi.activeSnapPoint.value ?? snapPoints[0]}`
)

function dotClass(point: MagicDrawerSnapPoint) {
  if (willSnapTo.value === point) {
    return 'bg-warning-solid'
  }
  if (drawerApi.activeSnapPoint.value === point) {
    return 'bg-success-solid'
  }
  return 'text-surface-subtle bg-current'
}

function onWillSnapTo(payload: MagicDrawerWillSnapToPayload) {
  if (payload.id === id) {
    willSnapTo.value = payload.snapPoint
  }
}

function onAfterSnap(payload: MagicEmitterEvents['afterSnap']) {
  if (payload.id === id) {
    willSnapTo.value = null
  }
}

// A drag that closes the drawer never settles on a snap point
function onAfterLeave(payload: MagicEmitterEvents['afterLeave']) {
  if (payload === id) {
    willSnapTo.value = null
  }
}

emitter.on('willSnapTo', onWillSnapTo)
emitter.on('afterSnap', onAfterSnap)
emitter.on('afterLeave', onAfterLeave)

onBeforeUnmount(() => {
  emitter.off('willSnapTo', onWillSnapTo)
  emitter.off('afterSnap', onAfterSnap)
  emitter.off('afterLeave', onAfterLeave)
})
</script>

<style>
[data-id='magic-drawer-will-snap-to-demo'] {
  --magic-drawer-height: 100svh;
}
</style>
