<template>
  <magic-modal
    :id="instanceId"
    class="magic-command-modal"
    :class="props.class"
    :options="options"
  >
    <div
      class="magic-command-modal__teleport"
      :data-id="`magic-command-teleport-${instanceId}`"
    >
      <slot />
    </div>
  </magic-modal>
</template>

<script setup lang="ts">
import { inject, watch, onBeforeUnmount, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { useMagicModal } from '../../../MagicModal'
import { useMagicCommand } from '../composables/useMagicCommand'
import { MagicCommandInstanceId } from './../symbols'

import type { MagicCommandModalOptions } from '../types'

interface MagicCommandProps {
  class?: MaybeRef<string>
  options?: MagicCommandModalOptions
}

const props = defineProps<MagicCommandProps>()

const instanceId = inject(MagicCommandInstanceId, '')
const emitter = useMagicEmitter()

function afterLeaveCallback() {
  close()
}

const { close, isActive } = useMagicCommand(instanceId)
const modalApi = useMagicModal(instanceId)

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

<style>
.magic-command-modal__teleport {
  display: contents;
}
</style>
