<template>
  <primitive
    ref="elRef"
    :as-child="asChild"
    :data-id="id"
    class="magic-menu-provider"
  >
    <slot />
  </primitive>
</template>

<script lang="ts" setup>
import {
  useTemplateRef,
  shallowRef,
  provide,
  watch,
  toValue,
  onBeforeUnmount,
  type MaybeRef,
} from 'vue'
import { onClickOutside, onKeyStroke, usePointer } from '@vueuse/core'
import { Primitive } from '@maas/vue-primitive'
import { defu } from 'defu'

import { useMenuState } from '../composables/private/useMenuState'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuKeyListener } from '../composables/private/useMenuKeyListener'
import { MagicMenuInstanceId } from '../symbols'
import { defaultOptions } from '../utils/defaultOptions'

import type { MagicMenuOptions } from '../types'

interface MagicMenuProviderProps {
  id: MaybeRef<string>
  asChild?: boolean
  options?: MagicMenuOptions
}

const { id, options } = defineProps<MagicMenuProviderProps>()
const elRef = useTemplateRef('elRef')

const mappedOptions = defu(options, defaultOptions)

const { initializeState, deleteState } = useMenuState(id)
const state = initializeState(mappedOptions)

// If the mode changes, save the current pointer position
// If the pointer moves, switch to mouse mode
const lastX = shallowRef(0)
const lastY = shallowRef(0)

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
} = useMenuKeyListener(id)

onKeyStroke('ArrowRight', onArrowRight)
onKeyStroke('ArrowLeft', onArrowLeft)
onKeyStroke('ArrowDown', onArrowDown)
onKeyStroke('ArrowUp', onArrowUp)
onKeyStroke('Escape', onEscape)
onKeyStroke('Enter', onEnter)
onKeyStroke('Tab', onTab)

// Handle off-click
const { unselectAllViews } = useMenuView(id)

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
      `[data-id='${toValue(id)}'] .magic-menu-trigger`,
      `[data-id='${toValue(id)}'] .magic-menu-item`,
      `.magic-menu-float`,
    ],
  }
)

// Lifecycle
onBeforeUnmount(() => {
  deleteState()
})

provide(MagicMenuInstanceId, id)
</script>

<style>
.magic-menu-provider {
  outline: none;
  user-select: none;
}
</style>
