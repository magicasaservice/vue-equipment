<template>
  <div class="w-full flex gap-2">
    <m-button @click="onClick">Add Toast</m-button>
    <m-select
      v-model="position"
      :options="options"
      label="Position"
      placeholder="Position"
    />
  </div>
  <magic-toast-provider
    id="magic-toast-position-demo"
    :options="{
      position,
    }"
  />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue'
import { MButton, MSelect } from '@maas/mirror/vue'
import { useMagicToast } from '@maas/vue-equipment/plugins/MagicToast'

const component = defineAsyncComponent(
  () => import('./components/DemoToast.vue')
)
const { add } = useMagicToast('magic-toast-position-demo')

const position = ref('bottom-right')

const options = [
  { value: 'top-right', label: 'Top Right' },
  { value: 'top', label: 'Top' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'left', label: 'Left' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'right', label: 'Right' },
]

function onClick() {
  const props = {
    message: options.find((p) => p.value === position.value)?.label,
  }

  add({ component, props })
}
</script>
