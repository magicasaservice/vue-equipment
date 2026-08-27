<template>
  <slot />
</template>

<script lang="ts" setup>
import {
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  provide,
  reactive,
  watch,
} from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useDrawerState } from '../composables/private/useDrawerState'
import { MagicDrawerActiveKey, MagicDrawerInstanceId } from '../symbols'

import type { MaybeRef } from 'vue'

import type { MagicDrawerOptions } from '../types/index'

interface MagicDrawerProviderProps {
  id: MaybeRef<string>
  options?: MagicDrawerOptions
}

const { options = {}, id } = defineProps<MagicDrawerProviderProps>()

const { initializeState } = useDrawerState(id)
const state = initializeState(options)

watch(
  () => options,
  (value) => {
    initializeState(value)
  },
  { deep: true }
)

function open() {
  state.active = true
}
function close() {
  state.active = false
}

const active = reactive({
  wrapperActive: false,
  innerActive: false,
})

async function onOpen() {
  active.wrapperActive = true
  await nextTick()
  active.innerActive = true
}

function onClose() {
  active.innerActive = false
}

watch(
  () => state.active,
  async (value) => {
    if (value) {
      await onOpen()
    } else {
      onClose()
    }
  }
)

if (state.options.keyListener.close) {
  onKeyStroke(state.options.keyListener.close, (e) => {
    close()
    e.preventDefault()
  })
}

onBeforeMount(() => {
  if (state.options.initial.open) {
    open()
  }
})

onBeforeUnmount(() => {
  close()
})

provide(MagicDrawerInstanceId, id)
provide(MagicDrawerActiveKey, active)
</script>
