<template>
  <div
    class="magic-menu-float"
    ref="elRef"
    :style="floatingStyles"
    :class="placementClasses"
  >
    <div
      v-if="hasArrow"
      ref="arrowRef"
      class="magic-menu-float__arrow"
      :style="arrowStyles"
    >
      <slot name="arrow">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,50 100,100 0,100" fill="currentColor" />
        </svg>
      </slot>
    </div>
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
  arrow,
  type Placement,
} from '@floating-ui/vue'
import { MagicMenuInstanceId, MagicMenuViewId } from '../symbols'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuState } from '../composables/private/useMenuState'

interface MagicMenuFloatProps {
  placement?: Placement
  arrow?: boolean
}

const props = defineProps<MagicMenuFloatProps>()

const elRef = ref<HTMLElement | undefined>(undefined)
const arrowRef = ref<HTMLElement | undefined>(undefined)

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

const hasArrow = computed(
  () => props.arrow || (state.options.mode === 'dropdown' && !view?.parent.item)
)

const mappedMiddleware = computed(() => {
  const middleware = [flip(), shift({ crossAxis: true, limiter: limitShift() })]

  if (hasArrow.value) {
    middleware.push(arrow({ element: arrowRef }))
  }

  return middleware
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

const { floatingStyles, placement, middlewareData } = useFloating(
  referenceEl,
  elRef,
  {
    placement: mappedPlacement,
    whileElementsMounted: autoUpdate,
    middleware: mappedMiddleware,
  }
)

const arrowStyles = computed(() => {
  if (!hasArrow.value) {
    return {}
  }

  let translate = 'translate3d('
  ;(translate +=
    middlewareData.value.arrow?.x != null
      ? `${middlewareData.value.arrow.x}px`
      : '0'),
    (translate += ', ')
  ;(translate +=
    middlewareData.value.arrow?.y != null
      ? `${middlewareData.value.arrow.y}px`
      : '0'),
    (translate += ', 0)')

  return {
    transform: translate,
  }
})

const placementClasses = computed(() => {
  return placement.value
    .split('-')
    .map((value) => `-${value}`)
    .join(' ')
})
</script>

<style>
.magic-menu-float {
  z-index: var(--magic-menu-float-z-index, 999);
  display: flex;
}

.magic-menu-float.-top {
  flex-direction: column-reverse;
}

.magic-menu-float.-bottom {
  flex-direction: column;
}

.magic-menu-float.-left {
  flex-direction: row-reverse;
}

.magic-menu-float.-right {
  flex-direction: row;
}

.magic-menu-float__arrow {
  width: var(--magic-menu-float-arrow-width, 0.75rem);
  height: var(--magic-menu-float-arrow-height, 0.75rem);
  color: var(--magic-menu-float-arrow-color, inherit);
  & svg {
    width: 100%;
    height: 100%;
  }
}
</style>
