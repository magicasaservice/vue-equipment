<template>
  <magic-modal-provider id="magic-modal-composed-demo" :options="{ focusTrap: false }">
    <magic-modal-trigger as-child>
      <m-button>Open Modal</m-button>
    </magic-modal-trigger>
    <magic-modal-teleport>
      <magic-modal-backdrop />
      <magic-modal-content>
        <div class="bg-surface-high aspect-[4/3] w-[40rem] rounded-md" />
      </magic-modal-content>
    </magic-modal-teleport>
  </magic-modal-provider>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import {
  MagicModalProvider,
  MagicModalTeleport,
  MagicModalBackdrop,
  MagicModalContent,
  MagicModalTrigger,
} from '@maas/vue-equipment/plugins/MagicModal'
</script>
