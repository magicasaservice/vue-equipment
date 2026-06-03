<template>
  <magic-modal-provider :id="instanceId" :options="options">
    <slot name="layout">
      <magic-modal-teleport>
        <magic-modal-backdrop />
        <magic-modal-content v-bind="$attrs">
          <slot />
        </magic-modal-content>
      </magic-modal-teleport>
    </slot>
  </magic-modal-provider>
</template>

<script lang="ts" setup>
import { inject, watch, onBeforeUnmount } from 'vue'
import { useMagicModal } from '@maas/vue-equipment/plugins/MagicModal'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useMagicCommand } from '../composables/useMagicCommand'
import { MagicCommandInstanceId } from '../symbols'
import type { MagicEmitterEvents } from '@maas/vue-equipment/plugins/MagicEmitter'
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
