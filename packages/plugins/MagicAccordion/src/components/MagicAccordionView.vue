<template>
  <primitive
    :as-child="asChild"
    :class="['magic-accordion-view', { '-active': view.active }]"
  >
    <slot :is-active="view?.active" />
  </primitive>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, provide, useId } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import {
  MagicAccordionInstanceId,
  MagicAccordionViewActive,
  MagicAccordionViewId,
} from '../symbols'
import { useAccordionView } from '../composables/private/useAccordionView'

interface MagicAccordionViewProps {
  asChild?: boolean
  id?: string
  activeOnMounted?: boolean
}

const props = defineProps<MagicAccordionViewProps>()

const instanceId = inject(MagicAccordionInstanceId, undefined)

if (!instanceId) {
  throw new Error(
    'MagicAccordionView must be nested inside MagicAccordionProvider'
  )
}

const mappedId = computed(() => props.id ?? `magic-accordion-view-${useId()}`)

// Register view
const { initializeView, deleteView } = useAccordionView(instanceId)

const view = initializeView({
  id: mappedId.value,
  active: props.activeOnMounted ?? false,
})

// Pass id and active state to children
provide(MagicAccordionViewId, mappedId.value)
provide(MagicAccordionViewActive, view.active)

// Lifecycle
onBeforeUnmount(() => {
  deleteView(mappedId.value)
})
</script>
