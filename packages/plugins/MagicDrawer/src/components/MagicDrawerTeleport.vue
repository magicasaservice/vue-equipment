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
import { computed, inject } from 'vue'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useDrawerState } from '../composables/private/useDrawerState'
import { MagicDrawerActiveKey, MagicDrawerInstanceId } from '../symbols'

import type { RendererElement } from 'vue'

import type { UseMagicErrorReturn } from '@maas/vue-equipment/plugins/MagicError'

interface MagicDrawerTeleportProps {
  to?: string | RendererElement
  disabled?: boolean
}

const props = withDefaults(defineProps<MagicDrawerTeleportProps>(), {
  disabled: undefined,
})

const instanceId = inject(MagicDrawerInstanceId, undefined)
const active = inject(MagicDrawerActiveKey, {
  wrapperActive: false,
  innerActive: false,
})

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
const mappedDisabled = computed(
  () => props.disabled ?? state.options.teleport.disabled
)
</script>
