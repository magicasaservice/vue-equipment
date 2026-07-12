<template>
  <div class="flex gap-2">
    <m-button @click="onClick">Add Toast</m-button>
    <m-button :disabled="toastCount === 0" @click="hide">Hide</m-button>
    <m-button :disabled="hiddenCount === 0" @click="show">Show</m-button>
  </div>
  <magic-toast-provider
    id="magic-toast-hide-show-demo"
    :options="{
      layout: {
        expand: false,
        max: 10,
      },
      initial: {
        expanded: true,
      },
    }"
  />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue'
import { MButton } from '@maas/mirror/vue'
import { useMagicToast } from '@maas/vue-equipment/plugins/MagicToast'

const count = ref(0)

const component = defineAsyncComponent(
  () => import('./components/DemoToast.vue')
)
const {
  add,
  hide,
  show,
  count: toastCount,
  hiddenCount,
} = useMagicToast('magic-toast-hide-show-demo')

function onClick() {
  count.value += 1

  const props = {
    message: count.value % 2 ? 'Magic as a Service™' : 'Vue Equipment',
  }

  add({ component, props })
}
</script>
