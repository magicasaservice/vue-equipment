<template>
  <div class="flex gap-2">
    <m-button @click="onClick">Add Toast</m-button>
    <m-button @click="clear">Clear All</m-button>
  </div>
  <magic-toast-provider id="magic-toast-clear-all-demo" />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue'
import { MButton } from '@maas/mirror/vue'
import { useMagicToast } from '@maas/vue-equipment/plugins'

const count = ref(0)

const component = defineAsyncComponent(
  () => import('./components/DemoToast.vue')
)
const { add, clear } = useMagicToast('magic-toast-clear-all-demo')

function onClick() {
  count.value += 1

  const props = {
    message: count.value % 2 ? 'Magic as a Service™' : 'Vue Equipment',
  }

  add({ component, props })
}
</script>
