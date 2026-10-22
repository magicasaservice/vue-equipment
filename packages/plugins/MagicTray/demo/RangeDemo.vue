<template>
  <div class="flex w-120 max-w-full flex-col gap-4 select-none">
    <div
      class="bg-surface-low relative flex aspect-16/9 w-full overflow-hidden rounded-[0.5rem]"
    >
      <magic-tray-provider :id="id" :options="options">
        <magic-tray-content
          :style="{
            '--magic-tray-radius': '0.5rem',
            '--magic-tray-drag-overshoot-outer': '0px',
          }"
        >
          <template #background>
            <div class="bg-surface-base h-full w-full" />
          </template>
          <div class="relative h-full w-full">
            <div
              class="text-surface absolute inset-y-0 right-0 flex items-center justify-center p-4 text-center"
              :style="{ left: percent(progress.left) }"
            >
              Drag the left edge
            </div>
          </div>
        </magic-tray-content>
      </magic-tray-provider>
    </div>

    <div class="relative h-4 w-full">
      <div
        v-for="(entry, index) in entries"
        :key="index"
        class="absolute top-1/2 -translate-y-1/2 rounded-full transition-colors duration-150"
        :class="entryClass(entry)"
        :style="entryStyle(entry)"
      />
      <div
        v-if="isDragging && ring !== undefined"
        class="border-accent-muted absolute top-1/2 size-4 -translate-1/2 rounded-full border-2"
        :style="{ left: percent(ring) }"
      />
      <div
        class="bg-primary-solid absolute inset-y-0 w-0.5 -translate-x-1/2 rounded-full"
        :style="{ left: percent(progress.left) }"
      />
    </div>

    <div
      class="bg-surface-base flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-[0.5rem] py-2 pr-2 pl-4 font-mono text-sm"
    >
      <span>
        <span class="text-surface-muted">activeSnapPoint.left</span>
        <span class="text-surface ml-3">{{ activeSnapPoint.left ?? '–' }}</span>
      </span>
      <div class="flex gap-1">
        <m-button
          v-for="option in modes"
          :key="option"
          :mode="mode === option ? 'subtle' : 'ghost'"
          size="xs"
          class="select-none"
          @click="mode = option"
        >
          {{ option }}
        </m-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useMagicTray } from '@maas/vue-equipment/plugins/MagicTray'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'

import type { MagicEmitterEvents } from '@maas/vue-equipment/plugins/MagicEmitter'
import type {
  MagicTrayOptions,
  MagicTraySnapMode,
  MagicTraySnapPoint,
} from '@maas/vue-equipment/plugins/MagicTray'

type RangeDemoEntry = number | { min: number; max: number }

const id = 'magic-tray-range-demo'
const modes: Array<MagicTraySnapMode> = ['closest', 'step']
const entries: Array<RangeDemoEntry> = [0, { min: 0.15, max: 0.4 }, 0.6]

const mode = ref<MagicTraySnapMode>('closest')

const options = computed<MagicTrayOptions>(() => ({
  snapPoints: { left: entries },
  snap: { mode: mode.value },
  threshold: { distance: 32 },
  inset: true,
}))

const { state, progress, activeSnapPoint } = useMagicTray(id, options.value)
const emitter = useMagicEmitter()

// Where a release would come to rest, reported while the left edge is dragged
const target = ref<number>()

const isDragging = computed(() => state.draggingSide === 'left')
const active = computed(() => toNumber(activeSnapPoint.value.left))

// willSnapTo only reports where the target entered a range, so inside one the
// ring follows the edge instead
const ring = computed(() => {
  const value = target.value

  if (value === undefined) {
    return undefined
  }

  const isInsideRange = entries.some(
    (entry) =>
      typeof entry !== 'number' && value > entry.min && value < entry.max
  )

  return isInsideRange ? progress.value.left : value
})

// Whether the edge rests at an entry, or will once released
function isResting(entry: RangeDemoEntry) {
  const value = isDragging.value ? target.value : active.value

  if (value === undefined) {
    return false
  }

  return typeof entry === 'number'
    ? value === entry
    : value >= entry.min && value <= entry.max
}

function entryClass(entry: RangeDemoEntry) {
  return [
    typeof entry === 'number' ? 'size-2 -translate-x-1/2' : 'h-2',
    isResting(entry) ? 'bg-accent-solid' : 'text-surface-subtle bg-current',
  ]
}

function entryStyle(entry: RangeDemoEntry) {
  return typeof entry === 'number'
    ? { left: percent(entry) }
    : { left: percent(entry.min), width: percent(entry.max - entry.min) }
}

function toNumber(point?: MagicTraySnapPoint) {
  return typeof point === 'number' ? point : undefined
}

function percent(value: number) {
  return `${value * 100}%`
}

function onWillSnapTo(payload: MagicEmitterEvents['willSnapTo']) {
  if (payload.id !== id || !('side' in payload) || payload.side !== 'left') {
    return
  }

  target.value = toNumber(payload.snapPoint)
}

emitter.on('willSnapTo', onWillSnapTo)

onBeforeUnmount(() => {
  emitter.off('willSnapTo', onWillSnapTo)
})
</script>
