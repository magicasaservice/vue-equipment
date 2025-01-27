<template>
  <client-only>
    <div class="magic-cookie-provider" v-bind="$attrs">
      <slot />
    </div>
  </client-only>
</template>

<script lang="ts" setup>
import { provide, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { useCookieState } from '../composables/private/useCookieState'
import { defaultOptions } from '../utils/defaultOptions'
import { MagicCookieInstanceId } from '../symbols'

import type { MagicCookieOptions } from '../types'

defineOptions({
  inheritAttrs: false,
})

type MagicCookieProviderProps = {
  id: MaybeRef<string>
  options?: MagicCookieOptions
}

const { id, options } = defineProps<MagicCookieProviderProps>()
const mappedOptions = defu(options, defaultOptions)

const { initializeState } = useCookieState(id)
initializeState(mappedOptions)

provide(MagicCookieInstanceId, id)
</script>
