<template>
  <div
    :id="toValue(id)"
    ref="drawerRef"
    :class="[
      'magic-draggable',
      {
        '-dragging': dragging,
        '-disabled': disabled,
      },
    ]"
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
        <component v-bind="props" :is="component" v-if="component" />
        <slot v-else />
        <div v-if="hasDragged" class="magic-draggable__overlay" />
      </component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, toValue, type Component, type MaybeRef } from 'vue'
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
  component?: Component
  options?: MagicDraggableOptions
}

const props = withDefaults(defineProps<MagicDraggableProps>(), {
  options: () => defaultOptions,
})

const mappedOptions = defu(props.options, defaultOptions)

const elRef = ref<HTMLElement | undefined>(undefined)
const wrapperRef = ref<HTMLDivElement | undefined>(undefined)

const { initializeState } = useDraggableState(props.id)
const { dragging } = initializeState()

// Make sure this is reactive
const disabled = computed(() => {
  if (props.options.disabled === undefined) {
    return defaultOptions.disabled
  } else {
    return props.options.disabled
  }
})

const { snapPoints, animation, initial, threshold, scrollLock } = mappedOptions

const { onPointerdown, onClick, style, hasDragged } = useDraggableDrag({
  id: props.id,
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

.magic-draggable.-disabled {
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

.magic-draggable.-dragging .magic-draggable__drag {
  cursor: grabbing;
  user-select: none;
}

.magic-draggable.-disabled .magic-draggable__drag {
  cursor: default;
}

.magic-draggable__overlay {
  position: absolute;
  inset: 0;
  z-index: 9999;
}
</style>
