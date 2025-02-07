<template>
  <primitive :id="id" :as-child="asChild" class="magic-accordion-provider">
    <slot />
  </primitive>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, provide, type MaybeRef } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import { MagicAccordionInstanceId } from '../symbols'
import type { MagicAccordionOptions } from '../types'
import { useAccordionState } from '../composables/private/useAccordionState'

interface MagicAccordionProviderProps {
  id: MaybeRef<string>
  asChild?: boolean
  options?: MagicAccordionOptions
}

const { id, asChild, options } = defineProps<MagicAccordionProviderProps>()

const { deleteState, initializeState } = useAccordionState(id)
initializeState(options)

// Lifecycle
onBeforeUnmount(() => {
  deleteState()
})

provide(MagicAccordionInstanceId, id)
</script>
