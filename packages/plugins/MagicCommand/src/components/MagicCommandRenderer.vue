<template>
  <div ref="elRef" class="magic-command-renderer" />
</template>

<script lang="ts" setup>
import { inject, onBeforeUnmount, useTemplateRef } from 'vue'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'
import { MagicCommandInstanceId } from './../symbols'

import { useCommandState } from '../composables/private/useCommandState'

const instanceId = inject(MagicCommandInstanceId, '')
const emitter = useMagicEmitter()

if (!instanceId) {
  throw new Error(
    'MagicCommandRenderer must be nested inside MagicCommandProvider'
  )
}

const elRef = useTemplateRef('elRef')

const { initializeState } = useCommandState(instanceId)
const state = initializeState()

function enterCallback(payload: MagicEmitterEvents['enter']) {
  if (typeof payload === 'string' && payload === instanceId) {
    state.renderer = elRef.value
  }
}

emitter.on('enter', enterCallback)

onBeforeUnmount(() => {
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
