<template>
  <m-button @click="modalApi.open"> Open Modal </m-button>
  <magic-modal id="default-demo" :options="{ focusTrap: false }">
    <div class="bg-surface-elevation-high w-[40rem] aspect-[4/3] rounded-md" />
  </magic-modal>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import { useMagicModal } from '@maas/vue-equipment/plugins'

const modalApi = useMagicModal('default-demo')
</script>
