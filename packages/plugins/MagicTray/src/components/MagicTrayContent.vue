<template>
  <div
    class="magic-tray-content"
    :data-id="mappedId"
    :data-dragging="state.dragging"
    :data-dragging-side="state.draggingSide"
    :data-dragged="hasDragged"
    :data-disabled="disabled"
    :data-inset="inset"
    :data-drag-top="draggableSides.includes('top')"
    :data-drag-right="draggableSides.includes('right')"
    :data-drag-bottom="draggableSides.includes('bottom')"
    :data-drag-left="draggableSides.includes('left')"
    v-bind="$attrs"
  >
    <div class="magic-tray-content__wrapper">
      <component
        :is="state.options.tag"
        ref="el"
        class="magic-tray-content__inner"
        :data-drag-top="draggableSides.includes('top')"
        :data-drag-right="draggableSides.includes('right')"
        :data-drag-bottom="draggableSides.includes('bottom')"
        :data-drag-left="draggableSides.includes('left')"
        :style="{ clipPath }"
      >
        <div class="magic-tray-content__bg" v-if="slots.background">
          <slot name="background" />
        </div>
        <div class="magic-tray-content__slot" v-if="slots.default">
          <slot />
        </div>
      </component>
      <div class="magic-tray-content__handles">
        <magic-tray-handle
          v-for="side in visibleHandles"
          :key="side"
          :side="side"
          :style="handleStyle(side)"
          @pointerdown="guardedPointerdown(side, $event)"
          @touchstart="guardedTouchstart(side, $event)"
        >
          <template
            v-if="slots[`handle-${side}`] || slots.handle"
            #default="slotProps"
          >
            <slot
              :name="slots[`handle-${side}`] ? `handle-${side}` : 'handle'"
              v-bind="slotProps"
            />
          </template>
        </magic-tray-handle>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTemplateRef, useSlots, computed, inject } from 'vue'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { useTrayState } from '../composables/private/useTrayState'
import { useTrayDrag } from '../composables/private/useTrayDrag'
import { useTrayProgress } from '../composables/private/useTrayProgress'
import MagicTrayHandle from './MagicTrayHandle.vue'
import { MagicTrayInstanceId } from '../symbols'

import type { TraySide } from '../types/index'

defineOptions({
  inheritAttrs: false,
})

const instanceId = inject(MagicTrayInstanceId, undefined)

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicTray',
  source: 'MagicTrayContent',
})

magicError.assert(instanceId, {
  message: 'MagicTrayContent must be nested inside MagicTrayProvider',
  errorCode: 'missing_instance_id',
})

const mappedId = instanceId ?? ''

const { initializeState } = useTrayState(mappedId)
const state = initializeState()

const elRef = useTemplateRef<HTMLElement>('el')

const disabled = computed(() => state.options.disabled)
const inset = computed(() => state.options.inset)

const slots = useSlots()

const {
  draggableSides,
  clipPath,
  handleStyle,
  hasDragged,
  onHandlePointerdown,
  onHandleTouchstart,
} = useTrayDrag({
  id: mappedId,
  elRef,
})

useTrayProgress({ id: mappedId, state })

const visibleHandles = computed<TraySide[]>(() => {
  const { handles } = state.options
  if (handles === false) {
    return []
  }
  if (handles === true) {
    return draggableSides.value
  }
  return draggableSides.value.filter((side) => handles[side] === true)
})

function guardedPointerdown(side: TraySide, event: PointerEvent) {
  if (!disabled.value) {
    onHandlePointerdown(side, event)
  }
}

function guardedTouchstart(side: TraySide, event: TouchEvent) {
  if (!disabled.value) {
    onHandleTouchstart(side, event)
  }
}
</script>

<style>
:root {
  --magic-tray-radius: 0px;
  --magic-tray-drag-overshoot: 3rem;
  --magic-tray-drag-overshoot-outer: var(--magic-tray-drag-overshoot);
  --magic-tray-drag-overshoot-inner: var(--magic-tray-drag-overshoot);
}

.magic-tray-content {
  pointer-events: none;
  position: var(--magic-tray-position, relative);
  display: var(--magic-tray-display, inline-block);
  color: inherit;
}

.magic-tray-content[data-inset='true'] {
  position: absolute;
  inset: 0;
}

.magic-tray-content[data-inset='true'][data-drag-top='true'] {
  top: calc(-1 * var(--magic-tray-drag-overshoot-outer));
}

.magic-tray-content[data-inset='true'][data-drag-right='true'] {
  right: calc(-1 * var(--magic-tray-drag-overshoot-outer));
}

.magic-tray-content[data-inset='true'][data-drag-bottom='true'] {
  bottom: calc(-1 * var(--magic-tray-drag-overshoot-outer));
}

.magic-tray-content[data-inset='true'][data-drag-left='true'] {
  left: calc(-1 * var(--magic-tray-drag-overshoot-outer));
}

.magic-tray-content[data-inset='true'] .magic-tray-content__wrapper {
  width: var(--magic-tray-width, 100%);
  height: var(--magic-tray-height, 100%);
}

.magic-tray-content__wrapper {
  position: relative;
  width: var(--magic-tray-width, max-content);
  height: var(--magic-tray-height, max-content);
  max-width: var(--magic-tray-max-width, none);
  max-height: var(--magic-tray-max-height, none);
}

.magic-tray-content__inner {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  will-change: clip-path;
}

.magic-tray-content__bg {
  position: absolute;
  inset: 0;
  z-index: var(--magic-tray-bg-z-index, -1);
}

.magic-tray-content__slot {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  pointer-events: auto;
}

.magic-tray-content[data-inset='true'] .magic-tray-content__slot {
  padding: var(--magic-tray-drag-overshoot-outer);
}

.magic-tray-content__inner[data-drag-top='true'] {
  padding-top: var(--magic-tray-drag-overshoot-outer);
}

.magic-tray-content__inner[data-drag-right='true'] {
  padding-right: var(--magic-tray-drag-overshoot-outer);
}

.magic-tray-content__inner[data-drag-bottom='true'] {
  padding-bottom: var(--magic-tray-drag-overshoot-outer);
}

.magic-tray-content__inner[data-drag-left='true'] {
  padding-left: var(--magic-tray-drag-overshoot-outer);
}

dialog.magic-tray-content__inner {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  inset: unset;
}

.magic-tray-content__handles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.magic-tray-content[data-disabled='true'] .magic-tray-content__handles {
  display: none;
}
</style>
