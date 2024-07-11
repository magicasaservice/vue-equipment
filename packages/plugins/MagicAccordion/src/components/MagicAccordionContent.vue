<template>
  <div :class="['magic-accordion-content', { '-active': isActive }]">
    <magic-auto-size>
      <transition
        :name="state.options.transition"
        :on-before-enter="onBeforeEnter"
        :on-enter="onEnter"
        :on-after-enter="onAfterEnter"
        :on-before-leave="onBeforeLeave"
        :on-leave="onLeave"
        :on-after-leave="onAfterLeave"
      >
        <primitive :as-child="asChild" v-if="isActive">
          <slot />
        </primitive>
      </transition>
    </magic-auto-size>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import { useAccordionView } from '../composables/private/useAccordionView'
import { useAccordionState } from '../composables/private/useAccordionState'
import { useAccordionCallback } from '../composables/private/useAccordionCallback'
import { MagicAccordionInstanceId, MagicAccordionViewId } from '../symbols'

import '@maas/vue-equipment/utils/css/animations/fade-in.css'

interface MagicAccordionContentProps {
  asChild?: boolean
}

defineProps<MagicAccordionContentProps>()

const instanceId = inject(MagicAccordionInstanceId, undefined)
const viewId = inject(MagicAccordionViewId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuContent must be nested inside MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuContent must be nested inside MagicMenuView')
}

const { initializeState } = useAccordionState(instanceId)
const state = initializeState()

const { getView } = useAccordionView(instanceId)
const view = getView(viewId)

const isActive = computed(() => view?.active)

const {
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
} = useAccordionCallback({
  instanceId,
  viewId,
})
</script>

<style>
:root {
  --magic-accordion-enter-animation: fade-in 150ms ease;
  --magic-accordion-leave-animation: none 200ms cubic-bezier(0.83, 0, 0.17, 1);
  --magic-accordion-size-transition: all 200ms cubic-bezier(0.83, 0, 0.17, 1);
  --magic-accordion-content-clip-path: inset(0);
}

.magic-accordion-content {
  --magic-auto-size-transition: var(--magic-accordion-size-transition);
  clip-path: var(--magic-accordion-content-clip-path);
}

.magic-accordion-enter-active {
  position: relative;
  animation: var(--magic-accordion-enter-animation);
}

.magic-accordion-leave-active {
  animation: var(--magic-accordion-leave-animation);
}
</style>
