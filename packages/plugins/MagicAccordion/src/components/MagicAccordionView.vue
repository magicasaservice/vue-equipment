<template>
  <primitive
    :as-child="asChild"
    :data-id="mappedId"
    :data-active="view?.active"
    class="magic-accordion-view"
  >
    <slot :view-active="view?.active" />
  </primitive>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, provide, useId } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import {
  MagicAccordionInstanceId,
  MagicAccordionViewActive,
  MagicAccordionViewId,
} from '../symbols'
import { useAccordionView } from '../composables/private/useAccordionView'

interface MagicAccordionViewProps {
  id?: string
  asChild?: boolean
  active?: boolean
}

const { id, active } = defineProps<MagicAccordionViewProps>()

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicAccordion',
  source: 'MagicAccordion',
})

const instanceId = inject(MagicAccordionInstanceId, undefined)

magicError.assert(instanceId, {
  message: 'MagicAccordionView must be nested inside MagicAccordionProvider',
  statusCode: 400,
})

const mappedId = computed(() => id ?? `magic-accordion-view-${useId()}`)
const mappedActive = computed(() => view.active)

// Register view
const { initializeView, deleteView } = useAccordionView(instanceId)

const view = initializeView({
  id: mappedId.value,
  active: active ?? false,
})

// Pass id and active state to children
provide(MagicAccordionViewId, mappedId.value)
provide(MagicAccordionViewActive, mappedActive)

// Lifecycle
onBeforeUnmount(() => {
  deleteView(mappedId.value)
})
</script>
