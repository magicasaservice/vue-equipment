<template>
  <div class="flex w-full gap-2">
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
      position: selected?.value,
    }"
  />
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { MButton, MSelect } from 'mirror-compat'
import { useMagicToast } from '@maas/vue-equipment/plugins/MagicToast'

import type { MagicToastOptions } from '@maas/vue-equipment/plugins/MagicToast'

type ToastPosition = NonNullable<MagicToastOptions['position']>

const component = defineAsyncComponent(
  () => import('./components/DemoToast.vue')
)
const { add } = useMagicToast('magic-toast-position-demo')

const position = ref<string | number>('bottom-right')

const options: Array<{ value: ToastPosition; label: string }> = [
  { value: 'top-right', label: 'Top Right' },
  { value: 'top', label: 'Top' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'left', label: 'Left' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'right', label: 'Right' },
]

const selected = computed(() =>
  options.find((option) => option.value === position.value)
)

function onClick() {
  const props = {
    message: selected.value?.label,
  }

  add({ component, props })
}
</script>
