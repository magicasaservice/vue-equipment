<template>
  <magic-modal
    :id="commandId"
    class="magic-command-modal"
    :options="options"
    v-bind="$attrs"
  >
    <slot />
  </magic-modal>
</template>

<script lang="ts" setup>
import { inject, watch, onBeforeUnmount } from 'vue'
import { useMagicEmitter } from '../../../MagicEmitter'
import { useMagicModal } from '../../../MagicModal'
import { useMagicCommand } from '../composables/useMagicCommand'
import { MagicCommandInstanceId } from '../symbols'

import type { MagicCommandModalOptions } from '../types'

defineOptions({
  inheritAttrs: false,
})

interface MagicCommandProps {
  options?: MagicCommandModalOptions
}

defineProps<MagicCommandProps>()

const commandId = inject(MagicCommandInstanceId, '')
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
