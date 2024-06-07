<template>
  <div class="magic-command-renderer" ref="elRef" />
</template>

<script setup lang="ts">
import { ref, inject, onBeforeUnmount } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { MagicCommandInstanceId } from './../symbols'

import { useCommandState } from '../composables/private/useCommandState'

const instanceId = inject(MagicCommandInstanceId, '')
const emitter = useMagicEmitter()

if (!instanceId) {
  throw new Error(
    'MagicCommandRenderer must be nested inside MagicCommandProvider'
  )
}

const elRef = ref<HTMLElement | undefined>(undefined)

const { initializeState } = useCommandState(instanceId)
const state = initializeState()

function enterCallback() {
  state.teleportTarget = elRef.value
}

emitter.on('enter', enterCallback)

onBeforeUnmount(() => {
  emitter.off('enter', enterCallback)
})
</script>
