<template>
  <div class="w-full flex items-center justify-center gap-4">
    <m-button @click="onClick"> Add toast </m-button>
  </div>
  <magic-toast-provider
    id="magic-toast-demo"
    :options="{
      position: 'bottom-center',
      layout: { max: 6 },
    }"
  />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref, onMounted } from 'vue'
import { MButton } from '@maas/mirror/vue'
import { useMagicToast } from '@maas/vue-equipment/plugins'

const count = ref(0)

const component = defineAsyncComponent(() => import('./demo/DemoToast.vue'))
const { add } = useMagicToast('magic-toast-demo')

function onClick() {
  count.value += 1

  const props = {
    message: count.value % 2 ? 'Magic as a Service™' : 'Vue Equipment',
  }

  add({ component, props })
}

onMounted(() => {
  // const props = {
  //   message: count.value % 2 ? 'Magic as a Service™' : 'Vue Equipment',
  // }
  // setInterval(() => {
  //   add({ component, props })
  // }, 2000)
})
</script>
