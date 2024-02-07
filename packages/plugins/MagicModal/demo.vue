<template>
  <div class="m-auto rounded flex flex-col w-60 gap-2 bg-gray-500/5">
    <button @click="open" class="w-full h-full px-6 py-4">Open modal</button>
  </div>
  <magic-modal :id="id" :class="className">
    <div tabindex="1" class="bg-gray-100 w-[40rem] h-[30rem] rounded-lg" />
  </magic-modal>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import {
  useModalApi,
  useModalEmitter,
  type ModalEvents,
} from '@maas/vue-equipment/plugins'

const id = 'magic-modal-demo'
const className = 'magic-modal--test-class'
const modalApi = useModalApi(id)
const { open } = modalApi

function callback(
  event: keyof ModalEvents,
  id: ModalEvents[keyof ModalEvents]
) {
  console.log(event, id)
}

useModalEmitter().on('*', callback)

onBeforeUnmount(() => {
  useModalEmitter().off('*', callback)
})
</script>
