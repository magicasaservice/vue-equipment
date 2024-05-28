<template>
  <div class="magic-menu-float" ref="elRef" :style="floatingStyles">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject } from 'vue'
import {
  useFloating,
  autoUpdate,
  flip,
  shift,
  limitShift,
  type Placement,
} from '@floating-ui/vue'
import { MagicMenuInstanceId, MagicMenuViewId } from '../symbols'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuState } from '../composables/private/useMenuState'

interface MagicMenuFloatProps {
  placement?: Placement
}

const props = defineProps<MagicMenuFloatProps>()

const elRef = ref<HTMLElement | undefined>(undefined)

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

const referenceEl = computed(() => {
  if (view?.click) {
    return {
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: view.click!.x,
          y: view.click!.y,
          top: view.click!.y,
          left: view.click!.x,
          right: view.click!.x,
          bottom: view.click!.y,
        }
      },
    }
  } else {
    return view?.children?.trigger
  }
})

const { floatingStyles } = useFloating(referenceEl, elRef, {
  placement: mappedPlacement,
  whileElementsMounted: autoUpdate,
  middleware: [
    flip(),
    shift({
      crossAxis: true,
      limiter: limitShift(),
    }),
  ],
})
</script>

<style>
.magic-menu-float {
  z-index: var(--magic-menu-float-z-index, 999);
}
</style>
