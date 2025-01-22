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

<script lang="ts" setup>
import { inject, watch, onBeforeUnmount } from 'vue'
import {
  useMagicModal,
  useMagicCommand,
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'
import { MagicCommandInstanceId } from '../symbols'

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

function afterLeaveCallback(payload: MagicEmitterEvents['afterLeave']) {
  if (typeof payload === 'string' && payload === instanceId) {
    close()
  }
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
