<template>
  <primitive ref="elRef" :as-child="asChild" class="magic-command-provider">
    <slot />
  </primitive>
</template>

<script lang="ts" setup>
import { ref, provide, watch, onBeforeUnmount, type MaybeRef } from 'vue'
import { onClickOutside, onKeyStroke, usePointer } from '@vueuse/core'
import { Primitive } from '@maas/vue-primitive'
import { defu } from 'defu'

import { useCommandState } from '../composables/private/useCommandState'
import { useCommandView } from '../composables/private/useCommandView'
// import { useCommandKeyListener } from '../composables/private/useCommandKeyListener'
import { MagicCommandInstanceId } from '../symbols'
import { defaultOptions } from '../utils/defaultOptions'

import type { MagicCommandOptions } from '../types'

interface MagicCommandProviderProps {
  id: MaybeRef<string>
  asChild?: boolean
  options?: MagicCommandOptions
}

const { id, options } = defineProps<MagicCommandProviderProps>()
const elRef = ref<HTMLElement | undefined>(undefined)

const mappedOptions = defu(options, defaultOptions)

const { initializeState, deleteState } = useCommandState(id)
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
// const {
//   onArrowRight,
//   onArrowLeft,
//   onArrowUp,
//   onArrowDown,
//   onEscape,
//   onEnter,
//   onTab,
// } = useCommandKeyListener(id)

// onKeyStroke('ArrowRight', onArrowRight)
// onKeyStroke('ArrowLeft', onArrowLeft)
// onKeyStroke('ArrowDown', onArrowDown)
// onKeyStroke('ArrowUp', onArrowUp)
// onKeyStroke('Escape', onEscape)
// onKeyStroke('Enter', onEnter)
// onKeyStroke('Tab', onTab)

// Handle off-click
const { unselectAllViews } = useCommandView(id)

onClickOutside(
  elRef,
  () => {
    if (state) {
      state.active = false
    }
    unselectAllViews()
  },
  {
    ignore: [
      '.magic-command-trigger',
      '.magic-command-item',
      'magic-command-float',
    ],
  }
)

// Lifecycle
onBeforeUnmount(() => {
  deleteState()
})

provide(MagicCommandInstanceId, id)
</script>

<style>
.magic-command-provider {
  outline: none;
  user-select: none;
}
</style>
