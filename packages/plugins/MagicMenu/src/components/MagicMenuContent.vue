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
          :placement="placement"
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
} from 'vue'
import type { Placement } from '@floating-ui/vue'
import { useMenuView } from '../composables/private/useMenuView'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuContentId,
} from '../symbols'

import '@maas/vue-equipment/utils/css/animations/fade-in.css'
import '@maas/vue-equipment/utils/css/animations/fade-out.css'
import { useMenuState } from '../composables/private/useMenuState'
import { useMenuCallback } from '../composables/private/useMenuCallback'
import { useMenuDOM } from '../composables/private/useMenuDOM'

defineOptions({
  inheritAttrs: false,
})

interface MagicMenuContentProps {
  placement?: Placement
  arrow?: boolean
  referenceEl?: MaybeRef<HTMLElement | ComponentPublicInstance>
}

defineProps<MagicMenuContentProps>()
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
})

// Split isActive into two values to animate content smoothly
const innerActive = ref(false)
const wrapperActive = ref(false)

// Handle state
async function onOpen() {
  wrapperActive.value = true
  await nextTick()
  innerActive.value = true
  await nextTick()
  if (view) {
    view.children.content = contentRef.value
  }
}

async function onClose() {
  innerActive.value = false
  await nextTick()
  wrapperActive.value = false
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

.magic-menu-content__initial-enter-active {
  animation: fade-in 50ms ease;
}

.magic-menu-content__final-leave-active {
  animation: fade-out 150ms ease;
}

.magic-menu-content__nested-enter-active {
  animation: fade-in 100ms ease;
}
</style>
