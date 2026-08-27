<template>
  <div class="magic-tray-provider">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { provide, watch } from 'vue'
import { useTrayState } from '../composables/private/useTrayState'
import { MagicTrayInstanceId } from '../symbols'

import type { MaybeRef } from 'vue'

import type { MagicTrayOptions } from '../types/index'

interface MagicTrayProviderProps {
  id: MaybeRef<string>
  options?: MagicTrayOptions
}

const { options = {}, id } = defineProps<MagicTrayProviderProps>()

const { initializeState } = useTrayState(id)
initializeState(options)

watch(
  () => options,
  (value) => {
    initializeState(value)
  },
  { deep: true }
)

provide(MagicTrayInstanceId, id)
</script>

<style>
.magic-tray-provider {
  display: contents;
}
</style>
