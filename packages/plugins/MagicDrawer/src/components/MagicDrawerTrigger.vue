<template>
  <vue-primitive
    class="magic-drawer-trigger"
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
import { computed, inject, toValue, type MaybeRef } from 'vue'
import { VuePrimitive } from '@maas/vue-primitive'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { useMagicDrawer } from '../composables/useMagicDrawer'
import { useDrawerState } from '../composables/private/useDrawerState'
import { MagicDrawerInstanceId } from '../symbols'

interface MagicDrawerTriggerProps {
  id?: MaybeRef<string>
  disabled?: boolean
  asChild?: boolean
}

const { id, disabled, asChild } = defineProps<MagicDrawerTriggerProps>()

const injectedInstanceId = inject(MagicDrawerInstanceId, undefined)

const mappedInstanceId = computed(() => id ?? injectedInstanceId)

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicDrawer',
  source: 'MagicDrawerTrigger',
})

magicError.assert(mappedInstanceId.value, {
  message:
    'MagicDrawerTrigger must be nested inside MagicDrawerProvider or an id must be provided',
  errorCode: 'missing_instance_id',
})

const mappedId = computed(() => toValue(mappedInstanceId.value ?? ''))

const { isActive, open, close } = useMagicDrawer(mappedId)

const { initializeState } = useDrawerState(mappedId)
const state = initializeState()

const mappedDisabled = computed(() => disabled ?? state.options.disabled)

function onClick() {
  if (!mappedDisabled.value) {
    if (!isActive.value) {
      open()
    } else {
      close()
    }
  }
}
</script>

<style>
.magic-drawer-trigger {
  cursor: var(--magic-drawer-trigger-cursor, pointer);
}

.magic-drawer-trigger[data-disabled='true'] {
  pointer-events: none;
}
</style>
