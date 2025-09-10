<template>
  <primitive :data-id="id" :as-child="asChild" class="magic-command-provider">
    <slot />
  </primitive>
</template>

<script lang="ts" setup>
import { shallowRef, provide, watch, onBeforeUnmount, type MaybeRef } from 'vue'
import { useMagicKeys, usePointer } from '@vueuse/core'
import { Primitive } from '@maas/vue-primitive'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { createDefu } from 'defu'

import { useCommandState } from '../composables/private/useCommandState'
import { useMagicCommand } from '../composables/useMagicCommand'
import { defaultOptions } from '../utils/defaultOptions'
import { MagicCommandInstanceId, MagicCommandProviderOptions } from '../symbols'

import type { MagicCommandOptions } from '../types'

interface MagicCommandProviderProps {
  id: MaybeRef<string>
  asChild?: boolean
  options?: MagicCommandOptions
}

const { id, options = {} } = defineProps<MagicCommandProviderProps>()

// Prevent keys arrays from being merged with default
const customDefu = createDefu((obj, key, value) => {
  if (key === 'open' || key === 'close' || key === 'next' || key === 'prev') {
    obj[key] = value
    return true
  }
})

const mappedOptions = customDefu(options, defaultOptions)

const { initializeState, deleteState } = useCommandState(id)
const state = initializeState(mappedOptions)

// If the mode changes, save the current pointer position
// If the pointer moves, switch to mouse mode
const lastX = shallowRef(0)
const lastY = shallowRef(0)

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
  if (x !== lastX.value || y !== lastY.value) {
    if (state) {
      state.input.type = 'pointer'
    }
  }
})

// Add key listener
const keys = useMagicKeys()
const commandApi = useMagicCommand(id)

const { open, close } = commandApi

const { logWarning } = useMagicError({
  prefix: 'MagicCommand',
  source: 'MagicCommandProvider',
})

if (mappedOptions.keyListener?.open) {
  for (const key of mappedOptions.keyListener.open) {
    const mappedKey = keys[key]

    if (!mappedKey) {
      logWarning(`The key “${key}” is not supported by MagicCommand`)
      continue
    }

    watch(mappedKey, (value) => {
      if (value) {
        open()
      }
    })
  }
}

if (mappedOptions.keyListener?.close) {
  for (const key of mappedOptions.keyListener.close) {
    const mappedKey = keys[key]

    if (!mappedKey) {
      logWarning(`The key “${key}” is not supported by MagicCommand`)
      continue
    }

    watch(mappedKey, (value) => {
      if (value) {
        close()
      }
    })
  }
}

// Lifecycle
onBeforeUnmount(() => {
  deleteState()
})

provide(MagicCommandInstanceId, id)
provide(MagicCommandProviderOptions, mappedOptions)
</script>

<style>
.magic-command-provider {
  outline: none;
  user-select: none;
}
</style>
