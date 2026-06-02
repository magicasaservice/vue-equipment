<template>
  <slot />
</template>

<script lang="ts" setup>
import {
  reactive,
  watch,
  nextTick,
  provide,
  onBeforeUnmount,
  type MaybeRef,
} from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useModalState } from '../composables/private/useModalState'
import { MagicModalInstanceId, MagicModalActiveKey } from '../symbols'

import type { MagicModalOptions } from '../types/index'

interface MagicModalProviderProps {
  id: MaybeRef<string>
  options?: MagicModalOptions
}

const { options = {}, id } = defineProps<MagicModalProviderProps>()

const { initializeState } = useModalState(id)
const state = initializeState(options)

function open() { state.active = true }
function close() { state.active = false }

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

onBeforeUnmount(() => {
  close()
})

provide(MagicModalInstanceId, id)
provide(MagicModalActiveKey, active)
</script>
