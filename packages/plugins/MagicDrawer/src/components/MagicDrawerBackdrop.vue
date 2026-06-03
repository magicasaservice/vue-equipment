<template>
  <transition :name="state.options.transition.backdrop">
    <div
      v-show="active.innerActive"
      class="magic-drawer-backdrop"
      :data-disabled="state.options.disabled"
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
import { useMagicDrawer } from '../composables/useMagicDrawer'
import { useDrawerState } from '../composables/private/useDrawerState'
import { MagicDrawerInstanceId, MagicDrawerActiveKey } from '../symbols'

import '@maas/vue-equipment/utils/css/keyframes/fade-in.css'
import '@maas/vue-equipment/utils/css/keyframes/fade-out.css'

const instanceId = inject(MagicDrawerInstanceId, undefined)
const active = inject(MagicDrawerActiveKey, {
  wrapperActive: false,
  innerActive: false,
})

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicDrawer',
  source: 'MagicDrawerBackdrop',
})

magicError.assert(instanceId, {
  message: 'MagicDrawerBackdrop must be nested inside MagicDrawerProvider',
  errorCode: 'missing_instance_id',
})

const { initializeState } = useDrawerState(instanceId ?? '')
const state = initializeState()

const { close } = useMagicDrawer(instanceId ?? '')

function guardedClose() {
  if (!state.options.disabled) {
    close()
  }
}
</script>

<style>
.magic-drawer-backdrop {
  position: var(--magic-drawer-backdrop-position, fixed);
  top: var(--magic-drawer-backdrop-top, 0);
  left: var(--magic-drawer-backdrop-left, 0);
  right: var(--magic-drawer-backdrop-right, 0);
  bottom: var(--magic-drawer-backdrop-bottom, 0);
  width: var(--magic-drawer-backdrop-width, 100%);
  height: var(--magic-drawer-backdrop-height, 100%);
  background-color: var(--magic-drawer-backdrop-color, rgba(0, 0, 0, 0.5));
  backdrop-filter: var(--magic-drawer-backdrop-filter, unset);
  z-index: var(
    --magic-drawer-backdrop-z-index,
    var(--magic-drawer-z-index, 999)
  );
  pointer-events: auto;
}

.magic-drawer-backdrop[data-disabled='true'] {
  pointer-events: none;
}

.magic-drawer-backdrop-enter-active {
  animation: fade-in 300ms ease;
}

.magic-drawer-backdrop-leave-active {
  animation: fade-out 300ms ease;
}
</style>
