<template>
  <div class="flex w-full gap-2">
    <m-button @click="onClick">Add Toast</m-button>
    <m-toggle v-model="draggable" label="Draggable" />
  </div>
  <magic-toast-provider id="magic-toast-per-toast-draggable-demo" />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue'
import { MButton, MToggle } from '@maas/mirror/vue'
import { useMagicToast } from '@maas/vue-equipment/plugins/MagicToast'

const component = defineAsyncComponent(
  () => import('./components/DemoToast.vue')
)
const { add } = useMagicToast('magic-toast-per-toast-draggable-demo')

const draggable = ref(true)

function onClick() {
  add({
    component,
    draggable: draggable.value,
    props: {
      message: draggable.value
        ? 'Drag me to dismiss'
        : 'This toast is not draggable',
    },
  })
}
</script>
