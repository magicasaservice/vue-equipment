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
  <MagicToast :id="id" class="-bottom-right" :options="options" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, computed, unref } from 'vue'
import { useToastApi } from '@maas/vue-equipment/plugins'

const component = defineAsyncComponent(() => import('./demo/DemoToast.vue'))
const props = computed(() => {
  const message =
    count.value % 5
      ? `Added ${count.value} toasts`
      : `Extended text for toast ${count.value} so that it is a bit larger in height for demonstration purposes`
  return { message }
})
const count = ref(0)

const options = {
  layout: {
    expand: 'click',
    max: 4,
  },
}

const id = 'magic-toast-demo'
const toastApi = useToastApi(id)
const { add, clear } = toastApi

function onClick() {
  count.value++
  add({ component, props: unref(props) })
}
</script>
