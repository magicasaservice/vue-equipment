<template>
  <div ref="elRef" class="magic-menu-provider">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, watch, type MaybeRef, onBeforeUnmount } from 'vue'
import { onClickOutside, onKeyStroke, usePointer } from '@vueuse/core'
import { defu } from 'defu'
import { useMenuState } from '../composables/private/useMenuState'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuKeyListener } from '../composables/private/useMenuKeyListener'
import { MagicMenuInstanceId } from '../symbols'
import { defaultOptions } from '../utils/defaultOptions'

import type { MagicMenuOptions } from '../types'

interface MagicMenuProviderProps {
  id: MaybeRef<string>
  options?: MagicMenuOptions
}

const props = defineProps<MagicMenuProviderProps>()
const elRef = ref<HTMLElement | undefined>(undefined)

const mappedOptions = defu(props.options, defaultOptions)

const { initializeState, deleteState } = useMenuState(props.id)
const state = initializeState(mappedOptions)

// If the mode changes, save the current pointer position
// If the pointer moves, switch to mouse mode
const lastX = ref(0)
const lastY = ref(0)

const { x, y } = usePointer()

watch(
  () => state?.input.type,
  (value) => {
    if (value === 'keyboard') {
      lastX.value = x.value
      lastY.value = y.value
    }
  }
)

watch([x, y], ([x, y]) => {
  if (x !== lastX.value || y !== lastY.value) {
    if (state) {
      state.input.type = 'pointer'
    }
  }
})

// Add key listener
const {
  onArrowRight,
  onArrowLeft,
  onArrowUp,
  onArrowDown,
  onEscape,
  onEnter,
  onTab,
} = useMenuKeyListener(props.id)

onKeyStroke('ArrowRight', onArrowRight)
onKeyStroke('ArrowLeft', onArrowLeft)
onKeyStroke('ArrowDown', onArrowDown)
onKeyStroke('ArrowUp', onArrowUp)
onKeyStroke('Escape', onEscape)
onKeyStroke('Enter', onEnter)
onKeyStroke('Tab', onTab)

// Handle off-click
const { unselectAllViews } = useMenuView(props.id)

onClickOutside(
  elRef,
  () => {
    if (state) {
      state.active = false
    }
    unselectAllViews()
  },
  {
    ignore: ['.magic-menu-trigger', '.magic-menu-item', 'magic-menu-float'],
  }
)

// Lifecycle
onBeforeUnmount(() => {
  deleteState()
})

provide(MagicMenuInstanceId, props.id)
</script>

<style>
.magic-menu-provider {
  outline: none;
  user-select: none;
}
</style>
