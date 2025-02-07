<template>
  <teleport v-if="wrapperActive" to="body">
    <transition
      :name="mappedTransition"
      :on-before-enter="onBeforeEnter"
      :on-enter="onEnter"
      :on-after-enter="onAfterEnter"
      :on-before-leave="onBeforeLeave"
      :on-leave="onLeave"
      :on-after-leave="onAfterLeave"
    >
      <div
        v-if="innerActive"
        class="magic-menu-content"
        :data-id="`${viewId}-content`"
        v-bind="$attrs"
      >
        <magic-menu-float
          :placement="view?.placement"
          :middleware="middleware"
          :arrow="arrow"
          :reference-el="referenceEl"
        >
          <template v-if="$slots.arrow && arrow" #arrow>
            <slot name="arrow" />
          </template>
          <template #default>
            <div
              ref="contentRef"
              class="magic-menu-content__inner"
              :data-pointer-disabled="pointerDisabled"
            >
              <slot />
            </div>
          </template>
        </magic-menu-float>
      </div>
    </transition>
    <template v-if="state.options.debug">
      <span
        v-for="point in coords"
        :key="`${point.x}${point.y}`"
        :style="{
          background: 'red',
          position: 'fixed',
          top: point.y + 'px',
          left: point.x + 'px',
          width: '4px',
          height: '4px',
          zIndex: 1000,
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
        }"
      />
    </template>
  </teleport>
</template>

<script lang="ts" setup>
import {
  ref,
  inject,
  provide,
  nextTick,
  watch,
  computed,
  type MaybeRef,
  type ComponentPublicInstance,
  onBeforeUnmount,
} from 'vue'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuState } from '../composables/private/useMenuState'
import { useMenuCallback } from '../composables/private/useMenuCallback'
import { useMenuDOM } from '../composables/private/useMenuDOM'
import { useMenuCursor } from '../composables/private/useMenuCursor'
import { ModeTransitions } from '../utils/modeTransitionDefaults'
import { ModeDelayMouseleave } from '../utils/modeDelayDefaults'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuContentId,
} from '../symbols'

import type { Middleware } from '@floating-ui/vue'

import '@maas/vue-equipment/utils/css/animations/fade-in.css'
import '@maas/vue-equipment/utils/css/animations/fade-out.css'

defineOptions({
  inheritAttrs: false,
})

interface MagicMenuContentProps {
  arrow?: boolean | undefined
  middleware?: Middleware[]
  transition?: string
  referenceEl?: MaybeRef<HTMLElement | ComponentPublicInstance>
}

const { arrow = undefined, transition } = defineProps<MagicMenuContentProps>()

const contentRef = ref<HTMLElement | undefined>(undefined)

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuContent must be nested inside MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuContent must be nested inside MagicMenuView')
}

const { getView, unselectView } = useMenuView(instanceId)
const view = getView(viewId)

const { initializeState } = useMenuState(instanceId)
const state = initializeState()

const pointerDisabled = computed(() => state.input.disabled.includes('pointer'))

const mappedTransition = computed(() => {
  switch (true) {
    case !!transition:
      return transition
    case !!view?.parent.item:
      return state.options.transition.content.nested
    case !!state.options.transition.content.default:
      return state.options.transition.content.default
    default:
      return ModeTransitions[state.options.mode]
  }
})

// Split isActive into two values to animate content smoothly
const innerActive = ref(false)
const wrapperActive = ref(false)

const {
  lockScroll,
  unlockScroll,
  addScrollLockPadding,
  removeScrollLockPadding,
} = useMenuDOM()
const {
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
} = useMenuCallback({
  state,
  instanceId,
  viewId,
  innerActive,
  wrapperActive,
  lockScroll,
  unlockScroll,
  addScrollLockPadding,
  removeScrollLockPadding,
})

// Handle state
async function onOpen() {
  wrapperActive.value = true
  await nextTick()
  innerActive.value = true
  await nextTick()
  initialize()
}

function onClose() {
  destroy()
  innerActive.value = false
}

watch(
  () => view?.active,
  async (value) => {
    if (value) {
      await onOpen()
    } else {
      onClose()
    }
  }
)

// Handle cursor
const {
  coords,
  destroy,
  initialize,
  isInsideTriangle,
  isInsideTo,
  isInsideFrom,
} = useMenuCursor(view!, state.options.debug)

function disableCursor() {
  state.input.disabled = [...state.input.disabled, 'pointer']
}

function enableCursor() {
  state.input.disabled = state.input.disabled.filter((x) => x !== 'pointer')
}

watch(isInsideTriangle, (value) => {
  if (value) {
    disableCursor()
  } else {
    enableCursor()
  }
})

watch(isInsideTo, (value) => {
  if (value) {
    enableCursor()
  }
})

const isOutside = computed(
  () => !isInsideTo.value && !isInsideFrom.value && !isInsideTriangle.value
)

watch(isOutside, (value, oldValue) => {
  if (value && !oldValue) {
    switch (state.options.mode) {
      case 'navigation':
        const delay =
          state.options.delay?.mouseleave ?? ModeDelayMouseleave.navigation
        unselectView(viewId, delay)
    }
  }
})

onBeforeUnmount(() => {
  destroy()
})

provide(MagicMenuContentId, `${viewId}-content`)
</script>

<style>
.magic-menu-content {
  user-select: none;
}

.magic-menu-content__inner {
  padding: 0;
  border: 0;
}

.magic-menu-content__inner[data-pointer-disabled='true'] {
  pointer-events: none;
}

.magic-menu-content--default-enter-active {
  animation: none;
}

.magic-menu-content--default-leave-active {
  animation: none;
}

.magic-menu-content--fade-enter-active {
  animation: fade-in 200ms ease;
}

.magic-menu-content--fade-leave-active {
  animation: fade-out 200ms ease;
}
</style>
