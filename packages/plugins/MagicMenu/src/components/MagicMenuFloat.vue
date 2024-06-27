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
          <polygon :points="polygonPoints" fill="currentColor" />
        </svg>
      </slot>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
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
  arrow,
  type Placement,
} from '@floating-ui/vue'
import { MagicMenuInstanceId, MagicMenuViewId } from '../symbols'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuState } from '../composables/private/useMenuState'

interface MagicMenuFloatProps {
  placement?: Placement
  arrow?: boolean
  referenceEl?: MaybeRef<HTMLElement | ComponentPublicInstance>
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
  () => props.arrow ?? (state.options.mode === 'dropdown' && !view?.parent.item)
)

const mappedMiddleware = computed(() => {
  const middleware = []

  switch (state.options.mode) {
    case 'menubar':
      if (!view?.parent.item) {
        middleware.push(
          flip({
            crossAxis: true,
          })
        )
      } else if (!!view?.parent.item) {
        middleware.push(
          flip({
            crossAxis: false,
          })
        )
        middleware.push(
          shift({
            crossAxis: true,
            limiter: limitShift(),
          })
        )
      }
      break
    case 'dropdown':
      middleware.push(
        flip({
          mainAxis: true,
          crossAxis: false,
        })
      )
      middleware.push(
        shift({
          mainAxis: true,
          crossAxis: false,
          limiter: limitShift(),
        })
      )
      if (hasArrow.value) {
        middleware.push(
          arrow({
            element: arrowRef.value,
          })
        )
      }
      break
    case 'context':
      middleware.push(
        flip({
          mainAxis: true,
          crossAxis: true,
        })
      )
      break
  }

  return middleware
})

const mappedReferenceEl = computed(() => {
  if (props.referenceEl) {
    return toValue(props.referenceEl)
  } else if (view?.click) {
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
    return document.querySelector(`[data-id="${viewId}-trigger"]`)
  }
})

const { floatingStyles, placement, middlewareData } = useFloating(
  mappedReferenceEl,
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

const polygonPoints = computed(() => {
  const position = placement.value.split('-')[0]

  switch (position) {
    case 'bottom':
      return '50,50 100,100 0,100'
    case 'top':
      return '50,50 100,0 0,0'
    case 'right':
      return '50,50 100,100 100,0'
    case 'left':
      return '50,50 0,100 0,0'
  }
})
</script>

<style>
.magic-menu-float {
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
