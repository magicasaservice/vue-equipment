<template>
  <div class="magic-cookie-provider">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { provide, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { useCookieState } from '../composables/private/useCookieState'
import { defaultOptions } from '../utils/defaultOptions'
import { MagicCookieInstanceId } from '../symbols'

import type { MagicCookieOptions } from '../types'

type MagicCookieProviderProps = {
  id: MaybeRef<string>
  options?: MagicCookieOptions
}

const { id, options } = defineProps<MagicCookieProviderProps>()

const { initializeState } = useCookieState(id)
initializeState(options)

provide(MagicCookieInstanceId, id)
</script>
