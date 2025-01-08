<template>
  <magic-drawer
    :id="commandId"
    class="magic-command-drawer"
    :options="options"
    v-bind="$attrs"
  >
    <slot />
  </magic-drawer>
</template>

<script setup lang="ts">
import { inject, watch, onBeforeUnmount } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { useMagicDrawer } from '../../../MagicDrawer/src/composables/useMagicDrawer'
import { useMagicCommand } from '../composables/useMagicCommand'
import { MagicCommandInstanceId } from './../symbols'

import type { MagicCommandDrawerOptions } from '../types'

defineOptions({
  inheritAttrs: false,
})

interface MagicCommandProps {
  options?: MagicCommandDrawerOptions
}

defineProps<MagicCommandProps>()

const commandId = inject(MagicCommandInstanceId, '')
const emitter = useMagicEmitter()

function afterLeaveCallback() {
  close()
}

const { close, isActive } = useMagicCommand(commandId)
const drawerApi = useMagicDrawer(commandId)

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
