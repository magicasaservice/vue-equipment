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
  <magic-toast :id="id" :class="position" />
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { defineAsyncComponent, ref, computed, unref } from 'vue'
import { useMagicToast, useMagicEmitter } from '@maas/vue-equipment/plugins'

const count = ref(0)
const props = computed(() => {
  const message =
    count.value % 5
      ? `Added ${count.value} toasts`
      : `Extended text for toast ${count.value} so that it is a bit larger in height for demonstration purposes`
  return { message }
})

const component = defineAsyncComponent(() => import('./demo/DemoToast.vue'))

const id = 'magic-toast-demo'
const toastApi = useMagicToast(id)
const { add, clear } = toastApi

const isSmallScreen = useMediaQuery('(max-width: 1024px)')
const position = computed(() =>
  isSmallScreen.value ? '-bottom-center' : '-bottom-right'
)

function onClick() {
  count.value++
  add({ component, props: unref(props) })
}

useMagicEmitter().on('*', (event, id) => {
  console.log(event, id)
})
</script>
