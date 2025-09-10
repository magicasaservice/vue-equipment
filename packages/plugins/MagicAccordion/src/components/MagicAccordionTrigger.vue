<template>
  <primitive
    ref="el"
    :as-child="asChild"
    :data-id="`${mappedViewId}-trigger`"
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
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
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

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicAccordion',
  source: 'MagicAccordion',
})

const elRef = useTemplateRef<InstanceType<typeof Primitive>>('el')

const instanceId = inject(MagicAccordionInstanceId, undefined)
const injectedViewId = inject(MagicAccordionViewId, undefined)

const mappedViewId = computed(() => viewId ?? injectedViewId)

magicError.assert(instanceId, {
  message: 'MagicAccordionTrigger must be nested inside MagicAccordionProvider',
  errorCode: 'missing_instance_id',
})

magicError.assert(mappedViewId.value, {
  message:
    'MagicAccordionTrigger must be nested inside MagicAccordionView or a viewId must be provided',
  errorCode: 'missing_view_id',
})

const { initializeState } = useAccordionState(instanceId)
const state = initializeState()

const { getView } = useAccordionView(instanceId)
const view = getView(mappedViewId.value)

const mappedDisabled = computed(
  () => (toValue(disabled) || state.options.disabled) ?? false
)

const { onMouseenter, onClick, onKeypress } = useAccordionTrigger({
  elRef,
  instanceId,
  mappedDisabled,
  viewId: mappedViewId.value,
  trigger: trigger,
})

onKeyStroke('Enter', onKeypress)
</script>

<style>
.magic-accordion-trigger[data-disabled='true'] {
  cursor: var(--magic-accordion-trigger-cursor-disabled, not-allowed);
}
</style>
