<template>
  <primitive
    :class="['magic-accordion-trigger', { '-disabled': toValue(disabled) }]"
    :as-child="asChild"
    as="button"
    ref="elRef"
    @mouseeenter="onMouseenter"
    @click="onClick"
  >
    <slot />
  </primitive>
</template>

<script lang="ts" setup>
import { inject, ref, toValue, watch, type MaybeRef } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import { onKeyStroke } from '@vueuse/core'
import { useAccordionView } from '../composables/private/useAccordionView'
import { useAccordionTrigger } from '../composables/private/useAccordionTrigger'
import { MagicAccordionInstanceId, MagicAccordionViewId } from '../symbols'
import type { Interaction } from '../types'

interface MagicAccordionTriggerProps {
  disabled?: MaybeRef<boolean>
  trigger?: Interaction
  asChild?: boolean
}

const props = withDefaults(defineProps<MagicAccordionTriggerProps>(), {
  disabled: false,
  trigger: 'click',
  asChild: false,
})
const elRef = ref<InstanceType<typeof Primitive> | undefined>(undefined)

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

const { onMouseenter, onClick, onEnter } = useAccordionTrigger({
  instanceId,
  viewId,
  elRef,
  disabled: props.disabled,
  trigger: props.trigger,
})

onKeyStroke('Enter', onEnter)
</script>
