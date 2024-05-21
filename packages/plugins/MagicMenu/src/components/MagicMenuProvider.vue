<template>
  <div class="magic-menu-provider" ref="elRef" tabindex="0">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, watch, type MaybeRef, onBeforeUnmount } from 'vue'
import { onClickOutside, onKeyStroke, usePointer } from '@vueuse/core'
import { useMenuState } from '../composables/private/useMenuState'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuItem } from '../composables/private/useMenuItem'
import { useMenuKeyListener } from '../composables/private/useMenuKeyListener'
import { MagicMenuInstanceId } from '../symbols'

interface MagicMenuProviderProps {
  id: MaybeRef<string>
}

const props = defineProps<MagicMenuProviderProps>()
const elRef = ref<HTMLElement | undefined>(undefined)

const { initializeState, deleteState } = useMenuState(props.id)
const state = initializeState()

// If the mode changes, save the current pointer position
// If the pointer moves, switch to mouse mode
const lastX = ref(0)
const lastY = ref(0)

const { x, y } = usePointer()

watch(
  () => state?.mode,
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
      state.mode = 'mouse'
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
