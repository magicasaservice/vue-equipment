<template>
  <div class="magic-command-provider">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { watch, provide, onBeforeUnmount, type MaybeRef } from 'vue'
import { createDefu } from 'defu'
import { useMagicKeys } from '@vueuse/core'
import { defaultOptions } from '../utils/defaultOptions'
import { useMagicCommand } from '../composables/useMagicCommand'
import { MagicCommandInstanceId, MagicCommandOptions } from '../symbols'

import type { CommandOptions } from './../types/index'

// Prevent keys arrays from being merged with default
const customDefu = createDefu((obj, key, value) => {
  if (key === 'open' || key === 'close' || key === 'next' || key === 'prev') {
    obj[key] = value
    return true
  }
})

interface MagicCommandProps {
  id: MaybeRef<string>
  options?: CommandOptions
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

onBeforeUnmount(() => {
  close()
})

provide(MagicCommandInstanceId, props.id)
provide(MagicCommandOptions, mappedOptions)
</script>
