<template>
  <div class="magic-menu-provider" ref="elRef">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, watch, type MaybeRef } from 'vue'
import { onClickOutside, onKeyStroke, usePointer } from '@vueuse/core'

import { MagicMenuInstanceId } from '../symbols'
import { useMenuState } from '../composables/private/useMenuState'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuItem } from '../composables/private/useMenuItem'
import { useMenuKeyListener } from '../composables/private/useMenuKeyListener'

interface MagicMenuProviderProps {
  id: MaybeRef<string>
}

const props = defineProps<MagicMenuProviderProps>()
const elRef = ref<HTMLElement | undefined>(undefined)

const { initializeState } = useMenuState(props.id)
const state = initializeState()

const { unselectAllViews } = useMenuView(props.id)
const { unselectAllItems } = useMenuItem(props.id)

const { onArrowRight, onArrowLeft, onArrowDown, onArrowUp, onEnter, onEscape } =
  useMenuKeyListener(props.id)

const lastX = ref(0)
const lastY = ref(0)

const { x, y } = usePointer()

// If the mode changes, save the current pointer position
watch(state.mode, (value) => {
  if (value === 'keyboard') {
    lastX.value = x.value
    lastY.value = y.value
  }
})

// If the pointer moves, switch to mouse mode
watch([x, y], ([x, y]) => {
  if (x !== lastX.value || y !== lastY.value) {
    state.mode.value = 'mouse'
  }
})

onKeyStroke('ArrowRight', onArrowRight)
onKeyStroke('ArrowLeft', onArrowLeft)
onKeyStroke('ArrowDown', onArrowDown)
onKeyStroke('ArrowUp', onArrowUp)
onKeyStroke('Enter', onEnter)
onKeyStroke('Escape', onEscape)

onClickOutside(
  elRef,
  () => {
    state.active.value = false
    unselectAllViews()
    unselectAllItems()
  },
  {
    ignore: ['.magic-menu-view', '.magic-menu-item'],
  }
)

provide(MagicMenuInstanceId, props.id)
</script>
