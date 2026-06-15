<template>
  <magic-tray-provider :id="id" :options="options">
    <magic-tray-content v-bind="$attrs">
      <template #background>
        <slot name="background" />
      </template>
      <slot />
      <template v-if="$slots.handle" #handle="slotProps">
        <slot name="handle" v-bind="slotProps" />
      </template>
    </magic-tray-content>
  </magic-tray-provider>
</template>

<script lang="ts" setup>
import { type MaybeRef } from 'vue'
import MagicTrayProvider from './MagicTrayProvider.vue'
import MagicTrayContent from './MagicTrayContent.vue'

import type { MagicTrayOptions } from '../types/index'

defineOptions({
  inheritAttrs: false,
})

interface MagicTrayProps {
  id: MaybeRef<string>
  options?: MagicTrayOptions
}

const { options, id } = defineProps<MagicTrayProps>()
</script>
