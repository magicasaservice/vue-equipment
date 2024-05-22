<template>
  <div class="magic-menu-float" ref="elRef" :style="floatingStyles">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject } from 'vue'
import { useFloating, autoUpdate, flip, type Placement } from '@floating-ui/vue'
import { MagicMenuInstanceId, MagicMenuViewId } from '../symbols'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuState } from '../composables/private/useMenuState'

interface MagicMenuFloatProps {
  placement?: Placement
}

const props = defineProps<MagicMenuFloatProps>()

const elRef = ref<HTMLElement | undefined>(undefined)
const referenceEl = ref<HTMLElement | null>(null)

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)

const { initializeState } = useMenuState(instanceId ?? '')
const state = initializeState()

const { getView } = useMenuView(instanceId ?? '')
const view = getView(viewId ?? '')

const mappedPlacement = computed(() => {
  if (props.placement) {
    return props.placement
  }

  switch (state.options.mode) {
    case 'menubar':
      return !view?.parent.item ? 'bottom-start' : 'right-start'
    case 'dropdown':
      return !view?.parent.item ? 'bottom' : 'right-start'
    case 'context':
      return 'right-start'
  }
})

const { floatingStyles } = useFloating(referenceEl, elRef, {
  placement: mappedPlacement,
  whileElementsMounted: autoUpdate,
  middleware: [flip()],
})

watch(
  () => viewId,
  (value) => {
    referenceEl.value = document.querySelector(`#${value}-trigger`)
  },
  { immediate: true }
)
</script>

<style>
.magic-menu-float {
  z-index: var(--magic-menu-float-z-index, 999);
}
</style>
