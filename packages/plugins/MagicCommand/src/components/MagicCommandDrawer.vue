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
import { useDrawerApi, useDrawerEmitter } from '../../../MagicDrawer'
import { useCommandApi } from './../composables/useCommandApi'
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

const { close, isActive } = useCommandApi(commandId)

watch(isActive, (value) => {
  if (value) {
    useDrawerApi(commandId).open()
  } else {
    useDrawerApi(commandId).close()
  }
})

useDrawerEmitter().on('afterLeave', afterLeaveCallback)

onBeforeUnmount(() => {
  useDrawerEmitter().off('afterLeave', afterLeaveCallback)
  close()
})
</script>
