<template>
  <div class="m-auto rounded flex flex-col w-60 gap-2 bg-gray-500/5">
    <button @click="open" class="w-full h-full px-6 py-4">Open modal</button>
  </div>
  <MagicModal :id="id">
    <div
      tabindex="1"
      class="bg-gray-300 w-[40rem] h-[30rem] flex justify-center items-center rounded-lg"
    />
  </MagicModal>
</template>

<script setup lang="ts">
import { useModalApi } from '@maas/vue-equipment/plugins'

const id = 'magic-modal-demo'
const modalApi = useModalApi(id)
const { open } = modalApi
</script>
