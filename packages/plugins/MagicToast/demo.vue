<template>
  <div class="w-full flex items-center justify-center gap-4">
    <div class="rounded flex flex-col w-60 gap-2 bg-gray-500/5">
      <button @click="onClick" class="w-full h-full px-6 py-4">
        Add toast
      </button>
    </div>
    <div class="rounded flex flex-col w-60 gap-2 bg-gray-500/5">
      <button @click="clear" class="w-full h-full px-6 py-4">Clear all</button>
    </div>
  </div>
  <MagicToast :id="id" class="-right -top" :options="options" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, computed, unref } from 'vue'
import { useToastApi } from '@maas/vue-equipment/plugins'

const component = defineAsyncComponent(() => import('./demo/DemoToast.vue'))
const props = computed(() => ({ message: `Added ${count.value} toasts` }))
const count = ref(0)

const id = 'magic-toast-demo'
const toastApi = useToastApi(id)
const { add, clear } = toastApi

const options = {
  layout: {
    max: 5,
  },
}

function onClick() {
  count.value++
  add({ component, props: unref(props) })
}
</script>
