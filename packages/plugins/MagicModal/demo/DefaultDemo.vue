<template>
  <m-button @click="modalApi.open">Open Modal</m-button>
  <magic-modal id="magic-modal-default-demo" :options="{ focusTrap: false }">
    <div class="bg-surface-high aspect-[4/3] w-[40rem] rounded-md" />
  </magic-modal>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import { useMagicModal } from '@maas/vue-equipment/plugins'

const modalApi = useMagicModal('magic-modal-default-demo')
</script>
