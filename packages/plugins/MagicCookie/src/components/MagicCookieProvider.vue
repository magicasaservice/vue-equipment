<template>
  <div class="magic-cookie-provider">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { provide, watch, type MaybeRef } from 'vue'
import { useCookieState } from '../composables/private/useCookieState'
import { MagicCookieInstanceId } from '../symbols'

import type { MagicCookieOptions } from '../types'

type MagicCookieProviderProps = {
  id: MaybeRef<string>
  options?: MagicCookieOptions
}

const { id, options } = defineProps<MagicCookieProviderProps>()

const { initializeState } = useCookieState(id)
initializeState(options)

watch(
  () => options,
  (value) => {
    initializeState(value)
  },
  { deep: true }
)

provide(MagicCookieInstanceId, id)
</script>
