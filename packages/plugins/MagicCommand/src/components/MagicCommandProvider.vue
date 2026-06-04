<template>
  <vue-primitive
    :data-id="id"
    :as-child="asChild"
    class="magic-command-provider"
  >
    <slot />
  </vue-primitive>
</template>

<script lang="ts" setup>
import { shallowRef, provide, watch } from 'vue'
import { useMagicKeys, usePointer } from '@vueuse/core'
import { VuePrimitive } from '@maas/vue-primitive'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useCommandState } from '../composables/private/useCommandState'
import { useMagicCommand } from '../composables/useMagicCommand'
import { MagicCommandInstanceId, MagicCommandProviderOptions } from '../symbols'
import type { MaybeRef } from 'vue'
import type { MagicCommandOptions } from '../types'

interface MagicCommandProviderProps {
  id: MaybeRef<string>
  asChild?: boolean
  options?: MagicCommandOptions
}

const { id, options = {} } = defineProps<MagicCommandProviderProps>()

const { initializeState } = useCommandState(id)
const state = initializeState(options)

watch(
  () => options,
  (value) => {
    initializeState(value)
  },
  { deep: true }
)

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

if (state.options.keyListener?.open) {
  for (const key of state.options.keyListener.open) {
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

if (state.options.keyListener?.close) {
  for (const key of state.options.keyListener.close) {
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

provide(MagicCommandInstanceId, id)
provide(MagicCommandProviderOptions, state.options)
</script>

<style>
.magic-command-provider {
  outline: none;
  user-select: none;
}
</style>
