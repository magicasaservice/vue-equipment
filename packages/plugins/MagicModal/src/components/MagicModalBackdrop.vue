<template>
  <transition :name="state.options.transition.backdrop">
    <div
      v-show="active.innerActive"
      class="magic-modal-backdrop"
      @click.self="guardedClose"
    >
      <slot />
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { useMagicModal } from '../composables/useMagicModal'
import { useModalState } from '../composables/private/useModalState'
import { MagicModalInstanceId, MagicModalActiveKey } from '../symbols'

import '@maas/vue-equipment/utils/css/keyframes/fade-in.css'
import '@maas/vue-equipment/utils/css/keyframes/fade-out.css'

const instanceId = inject(MagicModalInstanceId, undefined)
const active = inject(MagicModalActiveKey, { wrapperActive: false, innerActive: false })

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicModal',
  source: 'MagicModalBackdrop',
})

magicError.assert(instanceId, {
  message: 'MagicModalBackdrop must be nested inside MagicModalProvider',
  errorCode: 'missing_instance_id',
})

const { initializeState } = useModalState(instanceId ?? '')
const state = initializeState()

const { close } = useMagicModal(instanceId ?? '')

function guardedClose() {
  close()
}
</script>

<style>
.magic-modal-backdrop {
  position: fixed;
  inset: 0;
  pointer-events: auto;
  background-color: var(--magic-modal-backdrop-color, rgba(0, 0, 0, 0.5));
  backdrop-filter: var(--magic-modal-backdrop-filter, unset);
  z-index: var(--magic-modal-backdrop-z-index, 998);
}

.magic-modal-backdrop-enter-active {
  animation: fade-in 175ms ease;
}

.magic-modal-backdrop-leave-active {
  animation: fade-out 175ms ease;
}
</style>
