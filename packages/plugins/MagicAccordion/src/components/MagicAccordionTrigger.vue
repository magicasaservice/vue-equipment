<template>
  <primitive
    ref="el"
    :as-child="asChild"
    :data-id="`${viewId}-trigger`"
    :data-disabled="mappedDisabled"
    as="button"
    class="magic-accordion-trigger"
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
  viewId?: string
  disabled?: MaybeRef<boolean>
  trigger?: Interaction
  asChild?: boolean
}

const {
  viewId,
  disabled = false,
  trigger = 'click',
  asChild = false,
} = defineProps<MagicAccordionTriggerProps>()

const elRef = useTemplateRef<InstanceType<typeof Primitive>>('el')

const instanceId = inject(MagicAccordionInstanceId, undefined)
const injectedViewId = inject(MagicAccordionViewId, undefined)

const mappedViewId = computed(() => viewId ?? injectedViewId)

if (!instanceId) {
  throw new Error(
    'MagicAccordionTrigger must be nested inside MagicAccordionProvider'
  )
}

if (!mappedViewId.value) {
  throw new Error(
    'MagicAccordionTrigger must be nested inside MagicAccordionView or a viewId must be provided'
  )
}

const { initializeState } = useAccordionState(instanceId)
const state = initializeState()

const { getView } = useAccordionView(instanceId)
const view = getView(mappedViewId.value)

const mappedDisabled = computed(
  () => toValue(disabled) || state.options.disabled
)

const { onMouseenter, onClick, onEnter } = useAccordionTrigger({
  elRef,
  instanceId,
  viewId: mappedViewId.value,
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
