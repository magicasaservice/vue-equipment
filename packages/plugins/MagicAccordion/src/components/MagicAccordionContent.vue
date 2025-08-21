<template>
  <div
    class="magic-accordion-content"
    :data-active="view?.active"
    :data-id="`${viewId}-content`"
    :style="{ '--ma-duration': `${state.options.animation?.duration}ms` }"
  >
    <auto-size
      :width="false"
      :duration="mappedAnimation.duration"
      :easing="mappedAnimation.easing"
    >
      <transition
        :name="mappedTransition"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
        @after-leave="onAfterLeave"
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
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { useAccordionView } from '../composables/private/useAccordionView'
import { useAccordionState } from '../composables/private/useAccordionState'
import { useAccordionCallback } from '../composables/private/useAccordionCallback'
import { MagicAccordionInstanceId, MagicAccordionViewId } from '../symbols'

import '@maas/vue-equipment/utils/css/keyframes/fade-in.css'
import '@maas/vue-equipment/utils/css/keyframes/auto-size-out.css'

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

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicAccordion',
  source: 'MagicAccordionContent',
})

const instanceId = inject(MagicAccordionInstanceId, undefined)
const viewId = inject(MagicAccordionViewId, undefined)

magicError.assert(instanceId, {
  message: 'MagicAccordionContent must be nested inside MagicAccordionProvider',
  errorCode: 'missing_instance_id',
})

magicError.assert(viewId, {
  message: 'MagicAccordionContent must be nested inside MagicAccordionView',
  errorCode: 'missing_view_id',
})

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
