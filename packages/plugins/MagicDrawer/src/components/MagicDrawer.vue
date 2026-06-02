<template>
  <magic-drawer-provider :id="id" :options="options">
    <magic-drawer-teleport>
      <magic-drawer-backdrop v-if="showBackdrop">
        <slot name="backdrop" />
      </magic-drawer-backdrop>
      <magic-drawer-content v-bind="$attrs">
        <slot />
      </magic-drawer-content>
    </magic-drawer-teleport>
  </magic-drawer-provider>
</template>

<script lang="ts" setup>
import { computed, useSlots, type MaybeRef } from 'vue'
import { useDrawerState } from '../composables/private/useDrawerState'
import MagicDrawerProvider from './MagicDrawerProvider.vue'
import MagicDrawerTeleport from './MagicDrawerTeleport.vue'
import MagicDrawerBackdrop from './MagicDrawerBackdrop.vue'
import MagicDrawerContent from './MagicDrawerContent.vue'

import type { MagicDrawerOptions } from '../types/index'

defineOptions({
  inheritAttrs: false,
})

interface MagicDrawerProps {
  id: MaybeRef<string>
  options?: MagicDrawerOptions
}

const { options, id } = defineProps<MagicDrawerProps>()

const slots = useSlots()

const { initializeState } = useDrawerState(id)
const state = initializeState(options)

const showBackdrop = computed(() => state.options?.backdrop || !!slots.backdrop)
</script>
