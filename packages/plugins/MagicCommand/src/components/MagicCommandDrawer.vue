<template>
  <magic-drawer-provider :id="instanceId" :options="options">
    <slot name="layout">
      <magic-drawer-teleport>
        <magic-drawer-backdrop />
        <magic-drawer-content v-bind="$attrs">
          <slot />
        </magic-drawer-content>
      </magic-drawer-teleport>
    </slot>
  </magic-drawer-provider>
</template>

<script lang="ts" setup>
import { inject, watch, onBeforeUnmount } from 'vue'
import { useMagicDrawer } from '@maas/vue-equipment/plugins/MagicDrawer'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useMagicCommand } from '../composables/useMagicCommand'
import { MagicCommandInstanceId } from '../symbols'
import type { MagicEmitterEvents } from '@maas/vue-equipment/plugins/MagicEmitter'
import type { UseMagicErrorReturn } from '@maas/vue-equipment/plugins/MagicError'
import type { MagicCommandDrawerOptions } from '../types'

defineOptions({
  inheritAttrs: false,
})

interface MagicCommandDrawerProps {
  options?: MagicCommandDrawerOptions
}

defineProps<MagicCommandDrawerProps>()

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicCommand',
  source: 'MagicCommandDrawer',
})

const instanceId = inject(MagicCommandInstanceId, '')
const emitter = useMagicEmitter()

magicError.assert(instanceId, {
  message: 'MagicCommandDrawer must be nested inside MagicCommandProvider',
  errorCode: 'missing_instance_id',
})

function afterLeaveCallback(payload: MagicEmitterEvents['afterLeave']) {
  if (typeof payload === 'string' && payload === instanceId) {
    close()
  }
}

const { close, isActive } = useMagicCommand(instanceId)
const drawerApi = useMagicDrawer(instanceId)

watch(isActive, (value) => {
  if (value) {
    drawerApi.open()
  } else {
    drawerApi.close()
  }
})

emitter.on('afterLeave', afterLeaveCallback)

onBeforeUnmount(() => {
  emitter.off('afterLeave', afterLeaveCallback)
  close()
})
</script>
