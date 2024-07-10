<template>
  <primitive :as-child="asChild" class="magic-accordion-view">
    <slot />
  </primitive>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, provide } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import { uuid } from '@maas/vue-equipment/utils'
import {
  MagicAccordionInstanceId,
  MagicAccordionViewActive,
  MagicAccordionViewId,
} from '../symbols'
import { useAccordionView } from '../composables/private/useAccordionView'

interface MagicAccordionViewProps {
  asChild?: boolean
  id?: string
}

const props = defineProps<MagicAccordionViewProps>()

const instanceId = inject(MagicAccordionInstanceId, undefined)

if (!instanceId) {
  throw new Error(
    'MagicAccordionView must be nested inside MagicAccordionProvider'
  )
}

const mappedId = computed(() => props.id ?? `magic-accordion-view-${uuid()}`)

// Register view
const { initializeView, deleteView } = useAccordionView(instanceId)

const view = initializeView({
  id: mappedId.value,
})

// Pass id and active state to children
provide(MagicAccordionViewId, mappedId.value)
provide(MagicAccordionViewActive, view.active)

// Lifecycle
onBeforeUnmount(() => {
  deleteView(mappedId.value)
})
</script>
