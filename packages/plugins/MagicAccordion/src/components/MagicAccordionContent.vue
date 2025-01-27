<template>
  <div class="magic-accordion-content" :data-active="view?.active">
    <magic-auto-size :width="false">
      <transition
        mode="out-in"
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
    </magic-auto-size>
  </div>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import { useAccordionView } from '../composables/private/useAccordionView'
import { useAccordionState } from '../composables/private/useAccordionState'
import { useAccordionCallback } from '../composables/private/useAccordionCallback'
import { MagicAccordionInstanceId, MagicAccordionViewId } from '../symbols'

import '@maas/vue-equipment/utils/css/animations/fade-in.css'
import '@maas/vue-equipment/utils/css/animations/squash-y.css'
import '@maas/vue-equipment/utils/css/easings.css'

interface MagicAccordionContentProps {
  asChild?: boolean
  transition?: string
}

const { transition } = defineProps<MagicAccordionContentProps>()

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
  --magic-auto-size-transition: var(
    --magic-accordion-size-transition,
    all 200ms var(--ease-in-out-sharp)
  );
  clip-path: var(--magic-accordion-content-clip-path, inset(0));
}

.magic-accordion-enter-active {
  position: relative;
  animation: fade-in 150ms var(--ease-in-out);
}

.magic-accordion-leave-active {
  animation: squash-y 200ms var(--ease-in-out-sharp);
}
</style>
