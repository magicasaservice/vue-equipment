<template>
  <primitive
    ref="elRef"
    :as-child="asChild"
    :data-disabled="mappedDisabled"
    class="magic-accordion-trigger"
    as="button"
    @mouseenter="onMouseenter"
    @click="onClick"
  >
    <slot :view-active="view?.active" />
  </primitive>
</template>

<script lang="ts" setup>
import { useTemplateRef, inject, computed, toValue, type MaybeRef } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import { onKeyStroke } from '@vueuse/core'
import { useAccordionTrigger } from '../composables/private/useAccordionTrigger'
import { useAccordionState } from '../composables/private/useAccordionState'
import { useAccordionView } from '../composables/private/useAccordionView'
import { MagicAccordionInstanceId, MagicAccordionViewId } from '../symbols'

import type { Interaction } from '../types'

interface MagicAccordionTriggerProps {
  disabled?: MaybeRef<boolean>
  trigger?: Interaction
  asChild?: boolean
}

const {
  disabled = false,
  trigger = 'click',
  asChild = false,
} = defineProps<MagicAccordionTriggerProps>()

const elRef = useTemplateRef<InstanceType<typeof Primitive>>('elRef')

const instanceId = inject(MagicAccordionInstanceId, undefined)
const viewId = inject(MagicAccordionViewId, undefined)

if (!instanceId) {
  throw new Error(
    'MagicAccordionTrigger must be nested inside MagicAccordionProvider'
  )
}

if (!viewId) {
  throw new Error(
    'MagicAccordionTrigger must be nested inside MagicAccordionView'
  )
}

const { initializeState } = useAccordionState(instanceId)
const state = initializeState()

const { getView } = useAccordionView(instanceId)
const view = getView(viewId)

const mappedDisabled = computed(
  () => toValue(disabled) || state.options.disabled
)

const { onMouseenter, onClick, onEnter } = useAccordionTrigger({
  instanceId,
  viewId,
  elRef,
  disabled: disabled,
  trigger: trigger,
})

onKeyStroke('Enter', onEnter)
</script>

<style>
.magic-accordion-trigger[data-disabled='true'] {
  cursor: var(--magic-accordion-trigger-cursor-disabled, not-allowed);
}
</style>
