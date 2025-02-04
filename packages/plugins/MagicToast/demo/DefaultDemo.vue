<template>
    <m-button @click="onClick">Add toast</m-button>
  <magic-toast-provider
    id="magic-toast-demo"
    :options="{
      position: 'bottom-center',
      layout: { max: 5 },
    }"
  />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue'
import { MButton } from '@maas/mirror/vue'
import { useMagicToast } from '@maas/vue-equipment/plugins'

const count = ref(0)

const component = defineAsyncComponent(() => import('./components/DemoToast.vue'))
const { add } = useMagicToast('magic-toast-demo')

function onClick() {
  count.value += 1

  const props = {
    message: count.value % 2 ? 'Magic as a Service™' : 'Vue Equipment',
  }

  add({ component, props })
}


</script>
