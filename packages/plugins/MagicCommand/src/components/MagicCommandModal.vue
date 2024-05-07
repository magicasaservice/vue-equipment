<template>
  <magic-modal
    :id="commandId"
    class="magic-command-modal"
    :class="props.class"
    :options="options"
  >
    <slot />
  </magic-modal>
</template>

<script setup lang="ts">
import { inject, watch, onBeforeUnmount, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { useMagicModal } from '../../../MagicModal'
import { useMagicCommand } from '../composables/useMagicCommand'
import { CommandInstanceId } from './../symbols'

import type { CommandModalOptions } from '../types'

interface MagicCommandProps {
  class?: MaybeRef<string>
  options?: CommandModalOptions
}

const props = defineProps<MagicCommandProps>()

const commandId = inject(CommandInstanceId, '')
const emitter = useMagicEmitter()

function afterLeaveCallback() {
  close()
}

const { close, isActive } = useMagicCommand(commandId)
const modalApi = useMagicModal(commandId)

watch(isActive, (value) => {
  if (value) {
    modalApi.open()
  } else {
    modalApi.close()
  }
})

emitter.on('afterLeave', afterLeaveCallback)

onBeforeUnmount(() => {
  emitter.off('afterLeave', afterLeaveCallback)
  close()
})
</script>
