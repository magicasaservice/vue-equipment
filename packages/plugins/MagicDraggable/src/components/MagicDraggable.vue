<template>
  <div
    ref="drawerRef"
    class="magic-draggable"
    :id="toValue(id)"
    :class="[
      toValue(props.class),

      {
        '-dragging': dragging,
        '-disabled': disabled,
      },
    ]"
  >
    <div class="magic-draggable__wrapper" ref="wrapperRef">
      <component
        :is="mappedOptions.tag"
        ref="elRef"
        class="magic-draggable__drag"
        :style="style"
        @pointerdown="guardedPointerdown"
        @click="guardedClick"
      >
        <component v-if="component" v-bind="props" :is="component" />
        <slot v-else />
      </component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  watch,
  computed,
  nextTick,
  toValue,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  type Component,
  type MaybeRef,
} from 'vue'
import { defu } from 'defu'
import { useDraggableDrag } from '../composables/private/useDraggableDrag'
import { useDraggableState } from '../composables/private/useDraggableState'
import { defaultOptions } from '../utils/defaultOptions'

import type { DraggableOptions } from '../types'

interface MagicDrawerProps {
  id: MaybeRef<string>
  class?: MaybeRef<string>
  component?: Component
  props?: Record<string, unknown>
  options?: DraggableOptions
}

const props = withDefaults(defineProps<MagicDrawerProps>(), {
  options: () => defaultOptions,
})

const mappedOptions = defu(props.options, defaultOptions)

const elRef = ref<HTMLElement | undefined>(undefined)
const wrapperRef = ref<HTMLDivElement | undefined>(undefined)

const { findState } = useDraggableState(props.id)
const { dragging } = findState()

// Make sure this is reactive
const disabled = computed(() => {
  if (props.options.disabled === undefined) {
    return defaultOptions.disabled
  } else {
    return props.options.disabled
  }
})

const { threshold, snap } = mappedOptions

const { initialize, onPointerdown, onClick, style } = useDraggableDrag({
  id: props.id,
  // isActive,
  elRef,
  wrapperRef,
  threshold,
  // overshoot,
  snap,
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

onMounted(() => {
  initialize()
})
</script>

<style>
:root {
  /* --magic-draggable-height: 75svh;
  --magic-draggable-width: 100%; */
  --magic-draggable-z-index: 999;
  --magic-draggable-position: fixed;
  --magic-draggable-height: 100%;
  --magic-draggable-width: 100%;
  --magic-draggable-inset: 0;
  /* --magic-draggable-justify-content: center;
  --magic-draggable-align-items: flex-end;
  --magic-draggable-content-overflow-x: hidden;
  --magic-draggable-content-overflow-y: hidden; */
  /* --magic-draggable-enter-animation: slide-btt-in 300ms ease;
  --magic-draggable-leave-animation: slide-btt-out 300ms ease;
  --magic-draggable-drag-overshoot: 4rem;
  --magic-draggable-padding: 0px; */
}

.magic-draggable {
  position: var(--magic-draggable-position);
  width: var(--magic-draggable-width);
  height: var(--magic-draggable-height);
  z-index: var(--magic-draggable-z-index);
  inset: var(--magic-draggable-inset);
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
}

.magic-draggable.-dragging .magic-draggable__drag {
  cursor: grabbing;
  user-select: none;
}
</style>