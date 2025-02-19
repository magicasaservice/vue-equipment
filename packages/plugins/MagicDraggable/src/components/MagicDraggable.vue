<template>
  <div
    ref="drawerRef"
    :data-id="toValue(id)"
    :data-dragging="dragging"
    :data-disabled="disabled"
    class="magic-draggable"
    v-bind="$attrs"
  >
    <div ref="wrapperRef" class="magic-draggable__wrapper">
      <component
        :is="mappedOptions.tag"
        ref="elRef"
        class="magic-draggable__drag"
        :style="style"
        @pointerdown="guardedPointerdown"
        @click="guardedClick"
      >
        <slot />
        <div v-if="hasDragged" class="magic-draggable__overlay" />
      </component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, toValue, toRefs, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { useDraggableDrag } from '../composables/private/useDraggableDrag'
import { useDraggableState } from '../composables/private/useDraggableState'
import { defaultOptions } from '../utils/defaultOptions'

import type { MagicDraggableOptions } from '../types'

defineOptions({
  inheritAttrs: false,
})

interface MagicDraggableProps {
  id: MaybeRef<string>
  options?: MagicDraggableOptions
}

const { id, options = {} } = defineProps<MagicDraggableProps>()

const mappedOptions = defu(options, defaultOptions)

const elRef = ref<HTMLElement | undefined>(undefined)
const wrapperRef = ref<HTMLDivElement | undefined>(undefined)

const { initializeState } = useDraggableState(id)
const state = initializeState()

const { dragging } = toRefs(state)

// Make sure this is reactive
const disabled = computed(() => {
  if (options.disabled === undefined) {
    return defaultOptions.disabled
  } else {
    return options.disabled
  }
})

const { snapPoints, animation, initial, threshold, scrollLock } = mappedOptions

const { onPointerdown, onClick, style, hasDragged } = useDraggableDrag({
  id,
  elRef,
  wrapperRef,
  threshold,
  snapPoints,
  animation,
  initial,
  scrollLock,
})

// Public functions
function guardedPointerdown(event: PointerEvent) {
  if (!disabled.value) {
    onPointerdown(event)
  }
}

function guardedClick(event: PointerEvent) {
  if (!disabled.value) {
    onClick(event)
  }
}
</script>

<style>
.magic-draggable {
  position: var(--magic-draggable-position, fixed);
  width: var(--magic-draggable-width, 100%);
  height: var(--magic-draggable-height, 100%);
  z-index: var(--magic-draggable-z-index, 999);
  inset: var(--magic-draggable-inset, 0);
  pointer-events: none;
  background: transparent;
  color: inherit;
  padding: 0;
  border: none;
}

.magic-draggable[data-disabled='true'] {
  pointer-events: none;
}

.magic-draggable__wrapper {
  width: 100%;
  height: 100%;
  display: block;
}

.magic-draggable__drag {
  cursor: grab;
  user-select: none;
  pointer-events: auto;
  position: relative;
  display: inline-flex;
  width: auto;
  height: auto;
  transform-origin: center;
  touch-action: none;
}

.magic-draggable[data-dragging='true'] .magic-draggable__drag {
  cursor: grabbing;
  user-select: none;
}

.magic-draggable[data-disabled='true'] .magic-draggable__drag {
  cursor: default;
}

.magic-draggable__overlay {
  position: absolute;
  inset: 0;
  z-index: 9999;
}
</style>
