<template>
  <div class="w-full h-screen flex items-center justify-center">
    <div class="m-auto rounded flex flex-col w-60 gap-2 bg-gray-500/5">
      <button class="w-full h-full px-6 py-4" @click="open">Open modal</button>
    </div>
    <magic-modal :id="id">
      <div
        tabindex="1"
        class="bg-gray-300 w-[40rem] h-[30rem] flex justify-center items-center rounded-lg"
      />
    </magic-modal>
  </div>
</template>

<script lang="ts" setup>
const id = 'magic-modal-demo'
const modalApi = useModalApi(id)
const { open } = modalApi

useModalEmitter().on('*', (event, id) => {
  console.log(event, id)
})
</script>
