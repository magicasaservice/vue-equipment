<template>
  <div class="magic-command-provider">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, provide, onBeforeUnmount, type MaybeRef } from 'vue'
import { createDefu } from 'defu'
import { useMagicKeys, usePointer } from '@vueuse/core'
import { defaultOptions } from '../utils/defaultOptions'
import { useMagicCommand } from '../composables/useMagicCommand'
import { MagicCommandInstanceId, MagicCommandProviderOptions } from '../symbols'

import type { MagicCommandOptions } from './../types/index'
import { useCommandState } from '../composables/private/useCommandState'

// Prevent keys arrays from being merged with default
const customDefu = createDefu((obj, key, value) => {
  if (key === 'open' || key === 'close' || key === 'next' || key === 'prev') {
    obj[key] = value
    return true
  }
})

interface MagicCommandProps {
  id: MaybeRef<string>
  options?: MagicCommandOptions
}

const props = withDefaults(defineProps<MagicCommandProps>(), {
  options: () => defaultOptions,
})

const keys = useMagicKeys()
const commandApi = useMagicCommand(props.id)
const mappedOptions = customDefu(props.options, defaultOptions)

const { open, close } = commandApi

if (mappedOptions.keys?.open) {
  for (const key of mappedOptions.keys.open) {
    watch(keys[key], (value) => {
      if (value) {
        open()
      }
    })
  }
}

if (mappedOptions.keys?.close) {
  for (const key of mappedOptions.keys.close) {
    watch(keys[key], (value) => {
      if (value) {
        close()
      }
    })
  }
}

const { initializeState, deleteState } = useCommandState(props.id)
const state = initializeState(mappedOptions)

// If the input type changes to "keyboard", save the current pointer position
// If the pointer moves and the input state is not "disabled", switch to pointer mode
const lastX = ref(0)
const lastY = ref(0)

const { x, y } = usePointer()

watch(
  () => state?.input.type,
  (value) => {
    if (value === 'keyboard') {
      lastX.value = x.value
      lastY.value = y.value
    }
  }
)

watch([x, y], ([x, y]) => {
  if (
    state &&
    (x !== lastX.value || y !== lastY.value) &&
    state?.input.type === 'keyboard'
  ) {
    state.input.type = 'pointer'
  }
})

onBeforeUnmount(() => {
  deleteState()
})

provide(MagicCommandInstanceId, props.id)
provide(MagicCommandProviderOptions, mappedOptions)
</script>
