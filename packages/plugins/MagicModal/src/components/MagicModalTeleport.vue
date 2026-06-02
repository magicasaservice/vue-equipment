<template>
  <teleport
    v-if="active.wrapperActive"
    :to="mappedTo"
    :disabled="mappedDisabled"
  >
    <slot />
  </teleport>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { useModalState } from '../composables/private/useModalState'
import { MagicModalInstanceId, MagicModalActiveKey } from '../symbols'

import type { RendererElement } from 'vue'

interface MagicModalTeleportProps {
  to?: string | RendererElement
  disabled?: boolean
}

const props = withDefaults(defineProps<MagicModalTeleportProps>(), {
  disabled: undefined,
})

const instanceId = inject(MagicModalInstanceId, undefined)
const active = inject(MagicModalActiveKey, { wrapperActive: false, innerActive: false })

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicModal',
  source: 'MagicModalTeleport',
})

magicError.assert(instanceId, {
  message: 'MagicModalTeleport must be nested inside MagicModalProvider',
  errorCode: 'missing_instance_id',
})

const { initializeState } = useModalState(instanceId ?? '')
const state = initializeState()

const mappedTo = computed(() => props.to ?? state.options.teleport.target)
const mappedDisabled = computed(() => props.disabled ?? state.options.teleport.disabled)
</script>
