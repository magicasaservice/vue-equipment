<template>
  <button @click="open">Open first modal</button>
  <MagicModal :id="id">
    <div ref="target" tabindex="1" class="bg-black p-10 rounded-lg">
      First Modal
    </div>
  </MagicModal>
  <button @click="open_b">Open second modal</button>
  <MagicModal :id="id_b" :options="{ focusTrap: false, scrollLock: false }">
    <div ref="target_b" tabindex="1" class="bg-red-500 p-10 rounded-lg">
      Second Modal
    </div>
  </MagicModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useModalApi } from '@maas/vue-equipment/plugins'

const target = ref<HTMLElement | null>(null)
const modalApi = useModalApi()
const { open, id } = modalApi

const target_b = ref<HTMLElement | null>(null)
const modalApi_b = useModalApi()
const { open: open_b, id: id_b } = modalApi_b
</script>
