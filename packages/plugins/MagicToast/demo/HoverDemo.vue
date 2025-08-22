<template>
  <m-button @click="onClick">Add Toast</m-button>
  <magic-toast-provider id="magic-toast-hover-demo" :options="options" />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue'
import { MButton } from '@maas/mirror/vue'
import { useMagicToast } from '@maas/vue-equipment/plugins/MagicToast'

const count = ref(0)

const component = defineAsyncComponent(
  () => import('./components/DemoToast.vue')
)
const { add } = useMagicToast('magic-toast-hover-demo')

function onClick() {
  count.value += 1

  const props = {
    message: count.value % 2 ? 'Magic as a Service™' : 'Vue Equipment',
  }

  add({ component, props })
}

const options = {
  layout: {
    expand: 'hover',
  },
}
</script>
