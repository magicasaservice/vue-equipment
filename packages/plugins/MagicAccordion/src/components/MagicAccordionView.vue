<template>
  <vue-primitive
    :as-child="asChild"
    :data-id="mappedId"
    :data-active="mappedActive"
    class="magic-accordion-view"
  >
    <slot :view-active="mappedActive" />
  </vue-primitive>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, provide, useId } from 'vue'
import { VuePrimitive } from '@maas/vue-primitive'
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

const { id, active = false } = defineProps<MagicAccordionViewProps>()

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicAccordion',
  source: 'MagicAccordionView',
})

const instanceId = inject(MagicAccordionInstanceId, undefined)

magicError.assert(instanceId, {
  message: 'MagicAccordionView must be nested inside MagicAccordionProvider',
  errorCode: 'missing_instance_id',
})

const mappedId = computed(() => id ?? `magic-accordion-view-${useId()}`)
const mappedActive = computed(() => view.active)

// Register view
const { initializeView, deleteView } = useAccordionView(instanceId)

const view = initializeView({
  id: mappedId.value,
  active,
})

// Pass id and active state to children
provide(MagicAccordionViewId, mappedId.value)
provide(MagicAccordionViewActive, mappedActive)

// Lifecycle
onBeforeUnmount(() => {
  deleteView(mappedId.value)
})
</script>
