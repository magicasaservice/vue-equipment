<template>
  <div class="m-auto rounded flex flex-col w-60 gap-2 bg-gray-500/5">
    <button @click="addToast()" class="w-full h-full px-6 py-4">
      Add toast
    </button>
  </div>
  <MagicToast :id="id" class="-bottom -right" />
</template>

<script setup lang="ts">
import { useToastApi } from '@maas/vue-equipment/plugins'

const id = 'magic-toast-demo'
const toastApi = useToastApi(id)
const { initialize, addToast, instance } = toastApi

initialize()
</script>
