<template>
  <vue-primitive
    ref="el"
    class="magic-modal-trigger"
    :as-child="asChild"
    :data-id="`${mappedId}-trigger`"
    :data-active="isActive"
    :data-disabled="mappedDisabled"
    @click="onClick"
  >
    <slot :active="isActive" :disabled="mappedDisabled" />
  </vue-primitive>
</template>

<script lang="ts" setup>
import { computed, inject, useTemplateRef, toValue, type MaybeRef } from 'vue'
import { VuePrimitive } from '@maas/vue-primitive'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { useMagicModal } from '../composables/useMagicModal'
import { MagicModalInstanceId } from '../symbols'

interface MagicModalTriggerProps {
  id?: MaybeRef<string>
  disabled?: boolean
  asChild?: boolean
}

const { id, disabled, asChild } = defineProps<MagicModalTriggerProps>()

const elRef = useTemplateRef<InstanceType<typeof VuePrimitive>>('el')

const injectedInstanceId = inject(MagicModalInstanceId, undefined)

const mappedInstanceId = computed(() => id ?? injectedInstanceId)

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicModal',
  source: 'MagicModalTrigger',
})

magicError.assert(mappedInstanceId.value, {
  message:
    'MagicModalTrigger must be nested inside MagicModalProvider or an id must be provided',
  errorCode: 'missing_instance_id',
})

const mappedId = computed(() => toValue(mappedInstanceId.value ?? ''))

const { isActive, open, close } = useMagicModal(mappedId)

const mappedDisabled = computed(() => disabled ?? false)

function onClick() {
  if (!mappedDisabled.value) {
    isActive.value ? close() : open()
  }
}
</script>

<style>
.magic-modal-trigger {
  cursor: var(--magic-modal-trigger-cursor, pointer);
}

.magic-modal-trigger[data-disabled='true'] {
  pointer-events: none;
}
</style>
