<template>
  <m-button @click="onClick">Add Toast</m-button>
  <magic-toast-provider id="magic-toast-slot-demo" />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref, h, type Slots } from 'vue'
import { MButton } from '@maas/mirror/vue'
import { useMagicToast } from '@maas/vue-equipment/plugins/MagicToast'

const count = ref(0)

const component = defineAsyncComponent(
  () => import('./components/DemoToast.vue')
)

const { add } = useMagicToast('magic-toast-slot-demo')

function onClick() {
  count.value += 1

  // Break reactivity for count
  const mappedCount = count.value

  const slots: Slots = {
    default: () => [h('span', `Message #${mappedCount}`)],
  }

  add({ component, slots })
}
</script>
