<template>
  <div
    ref="el"
    class="magic-menu-float"
    :style="floatingStyles"
    :class="placementClasses"
  >
    <div
      v-if="hasArrow"
      ref="arrow"
      class="magic-menu-float__arrow"
      :style="arrowStyles"
    >
      <slot name="arrow">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon :points="polygonPoints" fill="currentColor" />
        </svg>
      </slot>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {
  useTemplateRef,
  computed,
  inject,
  toValue,
  type MaybeRef,
  type ComponentPublicInstance,
} from 'vue'
import {
  useFloating,
  autoUpdate,
  flip,
  shift,
  limitShift,
  arrow as floatingArrow,
  type Placement,
  type Middleware,
} from '@floating-ui/vue'
import { MagicMenuInstanceId, MagicMenuViewId } from '../symbols'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuState } from '../composables/private/useMenuState'
import { ModeFloatingStrategy } from '../utils/modeFloatingStrategyDefaults'

interface MagicMenuFloatProps {
  placement?: Placement
  middleware?: Middleware[]
  arrow?: boolean
  referenceEl?: MaybeRef<HTMLElement | ComponentPublicInstance>
}

const { placement, middleware, arrow, referenceEl } =
  defineProps<MagicMenuFloatProps>()

const elRef = useTemplateRef('el')
const arrowRef = useTemplateRef('arrow')

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)

const { initializeState } = useMenuState(instanceId ?? '')
const state = initializeState()

const { getView } = useMenuView(instanceId ?? '')
const view = getView(viewId ?? '')

const mappedPlacement = computed(() => {
  if (placement) {
    return placement
  }

  switch (state.options.mode) {
    case 'menubar':
      return !view?.parent.item ? 'bottom-start' : 'right-start'
    case 'dropdown':
      return !view?.parent.item ? 'bottom' : 'right-start'
    case 'context':
      return 'right-start'
    default:
      return undefined
  }
})

const hasArrow = computed(
  () => arrow ?? (state.options.mode === 'dropdown' && !view?.parent.item)
)

const mappedMiddleware = computed(() => {
  const combined = []

  if (middleware) {
    combined.push(...middleware)
  }

  switch (state.options.mode) {
    case 'menubar':
      if (!view?.parent.item) {
        combined.push(
          flip({
            crossAxis: true,
          })
        )
      } else if (!!view?.parent.item) {
        combined.push(
          flip({
            crossAxis: false,
          })
        )
        combined.push(
          shift({
            crossAxis: true,
            limiter: limitShift(),
          })
        )
      }
      break
    case 'dropdown':
      combined.push(
        flip({
          mainAxis: true,
          crossAxis: false,
        })
      )
      combined.push(
        shift({
          mainAxis: true,
          crossAxis: false,
          limiter: limitShift(),
        })
      )
      if (hasArrow.value) {
        combined.push(
          floatingArrow({
            element: arrowRef.value,
          })
        )
      }
      break
    case 'context':
      combined.push(
        flip({
          mainAxis: true,
          crossAxis: true,
        })
      )
      break
  }

  return combined
})

const mappedReferenceEl = computed(() => {
  if (referenceEl) {
    return toValue(referenceEl)
  } else if (view?.state.clicked) {
    return {
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: view.state.clicked!.x,
          y: view.state.clicked!.y,
          top: view.state.clicked!.y,
          left: view.state.clicked!.x,
          right: view.state.clicked!.x,
          bottom: view.state.clicked!.y,
        }
      },
    }
  } else {
    return document.querySelector(`[data-id="${viewId}-trigger"]`)
  }
})

const mappedStrategy = computed(() => {
  return (
    state.options.floating?.strategy ?? ModeFloatingStrategy[state.options.mode]
  )
})

const {
  floatingStyles,
  placement: floatingPlacement,
  middlewareData,
} = useFloating(mappedReferenceEl, elRef, {
  placement: mappedPlacement,
  strategy: mappedStrategy,
  whileElementsMounted: autoUpdate,
  middleware: mappedMiddleware,
})

const arrowStyles = computed(() => {
  if (!hasArrow.value) {
    return {}
  }

  const translate = `translate3d(${
    middlewareData.value.arrow?.x ? `${middlewareData.value.arrow.x}px` : '0'
  }, ${
    middlewareData.value.arrow?.y ? `${middlewareData.value.arrow.y}px` : '0'
  }, 0)`

  return {
    transform: translate,
  }
})

const placementClasses = computed(() => {
  return floatingPlacement.value
    .split('-')
    .map((value) => `-${value}`)
    .join(' ')
})

const polygonPoints = computed(() => {
  const position = floatingPlacement.value.split('-')[0]

  switch (position) {
    case 'bottom':
      return '50,50 100,100 0,100'
    case 'top':
      return '50,50 100,0 0,0'
    case 'right':
      return '50,50 100,100 100,0'
    case 'left':
      return '50,50 0,100 0,0'
    default:
      return undefined
  }
})
</script>

<style>
.magic-menu-float {
  display: flex;
  z-index: var(--magic-menu-float-z-index, 999);
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
