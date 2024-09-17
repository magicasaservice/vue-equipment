<template>
  <magic-modal
    :id="instanceId"
    class="magic-command-modal"
    :options="options"
    v-bind="$attrs"
  >
    <slot />
  </magic-modal>
</template>

<script setup lang="ts">
import { inject, watch, onBeforeUnmount } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { useMagicModal } from '../../../MagicModal'
import { useMagicCommand } from '../composables/useMagicCommand'
import { MagicCommandInstanceId } from './../symbols'

import type { MagicCommandModalOptions } from '../types'

defineOptions({
  inheritAttrs: false,
})

interface MagicCommandProps {
  options?: MagicCommandModalOptions
}

defineProps<MagicCommandProps>()

const instanceId = inject(MagicCommandInstanceId, '')
const emitter = useMagicEmitter()

if (!instanceId) {
  throw new Error(
    'MagicCommandModal must be nested inside MagicCommandProvider'
  )
}

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
.magic-command-modal {
  --magic-modal-content-overflow-y: hidden;
}
</style>
