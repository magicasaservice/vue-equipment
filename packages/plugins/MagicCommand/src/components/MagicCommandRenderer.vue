<template>
  <div ref="el" class="magic-command-renderer" />
</template>

<script lang="ts" setup>
import { inject, onBeforeUnmount, useTemplateRef } from 'vue'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins/MagicEmitter'
import { MagicCommandInstanceId } from './../symbols'

import { useCommandState } from '../composables/private/useCommandState'

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicCommand',
  source: 'MagicCommand',
})

const instanceId = inject(MagicCommandInstanceId, '')
const emitter = useMagicEmitter()

magicError.assert(instanceId, {
  message: 'MagicCommandRenderer must be nested inside MagicCommandProvider',
  errorCode: 'missing_instance_id',
})

const elRef = useTemplateRef('el')

const { initializeState } = useCommandState(instanceId)
const state = initializeState()

function enterCallback(payload: MagicEmitterEvents['enter']) {
  if (typeof payload === 'string' && payload === instanceId) {
    state.renderer = elRef.value
  }
}

emitter.on('enter', enterCallback)

onBeforeUnmount(() => {
  // Reset renderer on unmount for garbage collection
  state.renderer = null

  emitter.off('enter', enterCallback)
})
</script>

<style>
.magic-command-renderer {
  position: relative;
  width: var(--magic-command-renderer-width, 100%);
  height: var(--magic-command-renderer-height, 100%);
}

.magic-command-content--fade-enter-active {
  animation: fade-in 2000ms ease;
}

.magic-command-content--fade-leave-active {
  animation: fade-out 2000ms ease;
}
</style>
