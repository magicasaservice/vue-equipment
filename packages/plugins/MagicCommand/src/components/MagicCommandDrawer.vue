<template>
  <magic-drawer
    :id="instanceId"
    class="magic-command-drawer"
    :options="options"
    v-bind="$attrs"
  >
    <slot />
  </magic-drawer>
</template>

<script lang="ts" setup>
import { inject, watch, onBeforeUnmount } from 'vue'
import {
  useMagicDrawer,
  useMagicCommand,
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'
import { MagicCommandInstanceId } from '../symbols'
import type { MagicCommandDrawerOptions } from '../types'

defineOptions({
  inheritAttrs: false,
})

interface MagicCommandDrawerProps {
  options?: MagicCommandDrawerOptions
}

defineProps<MagicCommandDrawerProps>()

const instanceId = inject(MagicCommandInstanceId, '')
const emitter = useMagicEmitter()

if (!instanceId) {
  throw new Error(
    'MagicCommandDrawer must be nested inside MagicCommandProvider'
  )
}

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
