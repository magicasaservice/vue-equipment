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
import { useModalApi, useModalEmitter } from '../../../MagicModal'
import { useCommandApi } from './../composables/useCommandApi'
import { CommandInstanceId } from './../symbols'

import type { CommandModalOptions } from '../types'

interface MagicCommandProps {
  class?: MaybeRef<string>
  options?: CommandModalOptions
}

const props = defineProps<MagicCommandProps>()

const commandId = inject(CommandInstanceId, '')

function afterLeaveCallback() {
  close()
}

const { close, isActive } = useCommandApi(commandId)

watch(isActive, (value) => {
  if (value) {
    useModalApi(commandId).open()
  } else {
    useModalApi(commandId).close()
  }
})

useModalEmitter().on('afterLeave', afterLeaveCallback)

onBeforeUnmount(() => {
  useModalEmitter().off('afterLeave', afterLeaveCallback)
})
</script>
