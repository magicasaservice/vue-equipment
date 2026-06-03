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
import { useDrawerState } from '../composables/private/useDrawerState'
import { MagicDrawerInstanceId, MagicDrawerActiveKey } from '../symbols'

import type { RendererElement } from 'vue'

interface MagicDrawerTeleportProps {
  to?: string | RendererElement
  disabled?: boolean
}

const props = withDefaults(defineProps<MagicDrawerTeleportProps>(), {
  disabled: undefined,
})

const instanceId = inject(MagicDrawerInstanceId, undefined)
const active = inject(MagicDrawerActiveKey, { wrapperActive: false, innerActive: false })

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicDrawer',
  source: 'MagicDrawerTeleport',
})

magicError.assert(instanceId, {
  message: 'MagicDrawerTeleport must be nested inside MagicDrawerProvider',
  errorCode: 'missing_instance_id',
})

const { initializeState } = useDrawerState(instanceId ?? '')
const state = initializeState()

const mappedTo = computed(() => props.to ?? state.options.teleport.target)
const mappedDisabled = computed(() => props.disabled ?? state.options.teleport.disabled)
</script>
