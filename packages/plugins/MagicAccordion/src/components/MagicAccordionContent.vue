<template>
  <div
    class="magic-accordion-content"
    :data-active="view?.active"
    :style="{ '--ma-duration': `${state.options.animation?.duration}ms` }"
  >
    <auto-size
      :width="false"
      :duration="mappedAnimation.duration"
      :easing="mappedAnimation.easing"
    >
      <transition
        :name="mappedTransition"
        :on-before-enter="onBeforeEnter"
        :on-enter="onEnter"
        :on-after-enter="onAfterEnter"
        :on-before-leave="onBeforeLeave"
        :on-leave="onLeave"
        :on-after-leave="onAfterLeave"
      >
        <primitive v-show="view?.active" :as-child="asChild">
          <slot :view-active="view?.active" />
        </primitive>
      </transition>
    </auto-size>
  </div>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue'
import { defu } from 'defu'
import { AutoSize } from '@maas/vue-autosize'
import { Primitive } from '@maas/vue-primitive'
import { useAccordionView } from '../composables/private/useAccordionView'
import { useAccordionState } from '../composables/private/useAccordionState'
import { useAccordionCallback } from '../composables/private/useAccordionCallback'
import { MagicAccordionInstanceId, MagicAccordionViewId } from '../symbols'

import '@maas/vue-equipment/utils/css/animations/fade-in.css'
import '@maas/vue-equipment/utils/css/animations/auto-size-out.css'

import '@maas/vue-equipment/utils/css/easings.css'

interface MagicAccordionContentProps {
  asChild?: boolean
  transition?: string
  animation?: {
    duration: number
    easing: (t: number) => number
  }
}

const { transition, animation } = defineProps<MagicAccordionContentProps>()

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

const mappedTransition = computed(() => transition ?? state.options.transition)
const mappedAnimation = computed(() => defu(animation, state.options.animation))

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
.magic-accordion-content {
  clip-path: var(--magic-accordion-content-clip-path, inset(0));
}

.magic-accordion-enter-active {
  position: relative;
  animation: fade-in var(--ma-duration) var(--ease-in-out);
}

.magic-accordion-leave-active {
  animation: auto-size-out var(--ma-duration) var(--ease-in-out-sharp);
}
</style>
