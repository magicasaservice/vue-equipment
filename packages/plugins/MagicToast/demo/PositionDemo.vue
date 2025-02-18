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
import { useMagicToast } from '@maas/vue-equipment/plugins'

const component = defineAsyncComponent(
  () => import('./components/DemoToast.vue')
)
const { add } = useMagicToast('magic-toast-position-demo')

const position = ref('bottom-right')

const options = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'center-left', label: 'Center Left' },
  { value: 'center-right', label: 'Center Right' },
]

function onClick() {
  const props = {
    message: options.find((p) => p.value === position.value)?.label,
  }

  add({ component, props })
}
</script>
