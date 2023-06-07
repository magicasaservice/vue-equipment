<template>
  <p>Modal</p>
  <button @click="open">Open modal</button>
  <MagicModal :id="id">
    <div
      ref="target"
      tabindex="1"
      class="bg-black bg-opacity-80 w-[40rem] h-[30rem] flex justify-center items-center rounded-lg"
    >
      Modal
    </div>
  </MagicModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useModalApi } from '@maas/vue-equipment/plugins'

const target = ref<HTMLElement | null>(null)
const id = 'magic-modal-demo'
const modalApi = useModalApi(id)
const { open } = modalApi
</script>
