<template>
  <magic-drawer
    :id="commandId"
    class="magic-command-drawer"
    :class="props.class"
    :options="options"
  >
    <slot />
  </magic-drawer>
</template>

<script setup lang="ts">
import { inject, watch, onBeforeUnmount, type MaybeRef } from 'vue'
import { useMagicDrawer } from '../../../MagicDrawer'
import { useMagicCommand } from '../composables/useMagicCommand'
import { CommandInstanceId } from './../symbols'

import type { CommandDrawerOptions } from '../types'

interface MagicCommandProps {
  class?: MaybeRef<string>
  options?: CommandDrawerOptions
}

const props = defineProps<MagicCommandProps>()

const commandId = inject(CommandInstanceId, '')

function afterLeaveCallback() {
  close()
}

const { close, isActive } = useMagicCommand(commandId)
const drawerApi = useMagicDrawer(commandId)
const { emitter } = drawerApi

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
