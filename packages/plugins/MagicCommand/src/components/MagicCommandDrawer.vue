<template>
  <magic-drawer
    :id="instanceId"
    class="magic-command-drawer"
    :class="props.class"
    :options="options"
  >
    <slot />
  </magic-drawer>
</template>

<script setup lang="ts">
import { inject, watch, onBeforeUnmount, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { useMagicDrawer } from '../../../MagicDrawer'
import { useMagicCommand } from '../composables/useMagicCommand'
import { MagicCommandInstanceId } from './../symbols'

import type { MagicCommandDrawerOptions } from '../types'

interface MagicCommandProps {
  class?: MaybeRef<string>
  options?: MagicCommandDrawerOptions
}

const props = defineProps<MagicCommandProps>()

const instanceId = inject(MagicCommandInstanceId, '')
const emitter = useMagicEmitter()

if (!instanceId) {
  throw new Error(
    'MagicCommandDrawer must be nested inside MagicCommandProvider'
  )
}

function afterLeaveCallback() {
  close()
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

<style>
.magic-command-drawer__teleport {
  display: contents;
}
</style>
