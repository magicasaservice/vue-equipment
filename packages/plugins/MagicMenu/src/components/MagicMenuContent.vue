<template>
  <teleport to="body" v-if="wrapperActive">
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
        class="magic-menu-content"
        :data-id="`${viewId}-content`"
        v-bind="$attrs"
        v-if="innerActive"
      >
        <magic-menu-float
          :placement="view?.placement"
          :arrow="arrow"
          :reference-el="referenceEl"
        >
          <template #arrow v-if="$slots.arrow && arrow">
            <slot name="arrow" />
          </template>
          <template #default>
            <div class="magic-menu-content__inner" ref="contentRef">
              <slot />
            </div>
          </template>
        </magic-menu-float>
      </div>
    </transition>
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
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuContentId,
} from '../symbols'

import '@maas/vue-equipment/utils/css/animations/fade-in.css'
import '@maas/vue-equipment/utils/css/animations/fade-out.css'

defineOptions({
  inheritAttrs: false,
})

interface MagicMenuContentProps {
  arrow?: boolean | undefined
  referenceEl?: MaybeRef<HTMLElement | ComponentPublicInstance>
}

withDefaults(defineProps<MagicMenuContentProps>(), { arrow: undefined })

const contentRef = ref<HTMLElement | undefined>(undefined)

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuContent must be nested inside MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuContent must be nested inside MagicMenuView')
}

const { getView } = useMenuView(instanceId)
const view = getView(viewId)

const { initializeState } = useMenuState(instanceId)
const state = initializeState()

const mappedTransition = computed(() => {
  switch (true) {
    case !!view?.parent.item:
      return state.options.transition?.nested
    case state.active:
      return state.options.transition?.initial
    case !state.active:
      return state.options.transition?.final
    default:
      return ''
  }
})

// Split isActive into two values to animate content smoothly
const innerActive = ref(false)
const wrapperActive = ref(false)

const { lockScroll, unlockScroll } = useMenuDOM()
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
  lockScroll,
  unlockScroll,
  wrapperActive,
})

// Handle cursor
const mappedClick = computed(() => view?.click)
const mappedPlacement = computed(() => view?.placement ?? 'bottom')
const mappedTrigger = computed(
  () => document.querySelector(`[data-id="${viewId}-trigger"]`) as HTMLElement
)

const { destroy, initialize, isInsideTriangle, isInsideTo } = useMenuCursor({
  from: mappedTrigger,
  to: contentRef,
  placement: mappedPlacement,
  click: mappedClick,
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

function disableCursor() {
  state.input.disabled = [...state.input.disabled, 'pointer']
}

function enableCursor() {
  state.input.disabled = state.input.disabled.filter((x) => x !== 'pointer')
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
  } else {
    switch (state.options.mode) {
      case 'navigation':
        if (!isInsideTriangle.value) {
          view!.active = false
        }
    }
  }
})

onBeforeUnmount(async () => {
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

.magic-menu-content--initial-enter-active {
  animation: fade-in 0ms ease;
}

.magic-menu-content--final-leave-active {
  animation: fade-out 200ms ease;
}

.magic-menu-content--nested-enter-active {
  animation: fade-in 300ms ease;
}
</style>
