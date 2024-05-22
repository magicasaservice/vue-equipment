<template>
  <div class="magic-menu-provider" ref="elRef" tabindex="0">
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
const state = initializeState()

// Save options to state for all children to access
watch(
  () => mappedOptions,
  (value) => {
    state.options = value
  },
  { immediate: true, deep: true }
)

// If the mode changes, save the current pointer position
// If the pointer moves, switch to mouse mode
const lastX = ref(0)
const lastY = ref(0)

const { x, y } = usePointer()

watch(
  () => state?.input,
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
      state.input = 'mouse'
    }
  }
})

// Add key listener
const { onArrowRight, onArrowLeft, onArrowUp, onArrowDown, onEscape } =
  useMenuKeyListener(props.id)

onKeyStroke('ArrowRight', onArrowRight)
onKeyStroke('ArrowLeft', onArrowLeft)
onKeyStroke('ArrowDown', onArrowDown)
onKeyStroke('ArrowUp', onArrowUp)
onKeyStroke('Escape', onEscape)

// Handle off-click
const { unselectAllViews } = useMenuView(props.id)

onClickOutside(
  elRef,
  () => {
    unselectAllViews()
    if (state) {
      state.active = false
    }
  },
  {
    ignore: ['.magic-menu-view', '.magic-menu-item'],
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
}
</style>
