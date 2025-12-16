<template>
  <vue-primitive
    :data-id="id"
    :as-child="asChild"
    class="magic-accordion-provider"
  >
    <slot />
  </vue-primitive>
</template>

<script lang="ts" setup>
import { provide, type MaybeRef } from 'vue'
import { VuePrimitive } from '@maas/vue-primitive'
import { useAccordionState } from '../composables/private/useAccordionState'
import { MagicAccordionInstanceId } from '../symbols'
import type { MagicAccordionOptions } from '../types'

interface MagicAccordionProviderProps {
  id: MaybeRef<string>
  asChild?: boolean
  options?: MagicAccordionOptions
}

const { id, asChild, options } = defineProps<MagicAccordionProviderProps>()

const { initializeState } = useAccordionState(id)
initializeState(options)

provide(MagicAccordionInstanceId, id)
</script>
