<template>
  <magic-modal-provider :id="id" :options="options">
    <magic-modal-teleport>
      <magic-modal-backdrop>
        <slot name="backdrop" />
      </magic-modal-backdrop>
      <magic-modal-content v-bind="$attrs">
        <slot />
      </magic-modal-content>
    </magic-modal-teleport>
  </magic-modal-provider>
</template>

<script lang="ts" setup>
import { type MaybeRef } from 'vue'
import MagicModalProvider from './MagicModalProvider.vue'
import MagicModalTeleport from './MagicModalTeleport.vue'
import MagicModalBackdrop from './MagicModalBackdrop.vue'
import MagicModalContent from './MagicModalContent.vue'

import type { MagicModalOptions } from '../types/index'

defineOptions({
  inheritAttrs: false,
})

interface MagicModalProps {
  id: MaybeRef<string>
  options?: MagicModalOptions
}

const { options, id } = defineProps<MagicModalProps>()
</script>
