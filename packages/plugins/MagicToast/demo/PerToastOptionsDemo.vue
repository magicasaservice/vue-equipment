<template>
  <div class="grid w-full grid-cols-2 items-end gap-3 sm:grid-cols-3">
    <m-toggle v-model="draggable" label="Draggable" />
    <m-select
      v-model="direction"
      :options="directionOptions"
      label="Drag direction"
      placeholder="Drag direction"
    />
    <m-input v-model="duration" type="number" label="Auto-dismiss (ms)" />
    <m-input v-model="distance" type="number" label="Dismiss distance (px)" />
    <m-input v-model="snapDuration" type="number" label="Snap duration (ms)" />
    <m-button class="w-full" @click="onClick">Add Toast</m-button>
  </div>
  <magic-toast-provider
    :id="id"
    :options="{
      position: 'bottom-right',
      layout: { expand: false, max: 10 },
      initial: { expanded: true },
    }"
  />
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, shallowRef } from 'vue'
import { MButton, MInput, MSelect, MToggle } from '@maas/mirror/vue'
import { useMagicToast } from '@maas/vue-equipment/plugins/MagicToast'
import type { MagicToastAddOptions } from '@maas/vue-equipment/plugins/MagicToast'

const id = 'magic-toast-per-toast-options-demo'
const component = defineAsyncComponent(
  () => import('./components/DemoToast.vue')
)
const { add } = useMagicToast(id)

const draggable = shallowRef(true)
const duration = shallowRef(0)
const distance = shallowRef(32)
const snapDuration = shallowRef(300)
const direction = shallowRef('auto')

const directionOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
  { value: 'left-right', label: 'Left & Right' },
  { value: 'up-down', label: 'Up & Down' },
]

type Direction = NonNullable<
  NonNullable<MagicToastAddOptions['drag']>['direction']
>
const resolvedDirection = computed<Direction>(() => {
  switch (direction.value) {
    case 'left-right':
      return ['left', 'right']
    case 'up-down':
      return ['up', 'down']
    case 'left':
    case 'right':
    case 'up':
    case 'down':
      return direction.value
    default:
      return 'auto'
  }
})

function onClick() {
  add({
    component,
    props: { message: draggable.value ? 'Drag me around' : 'Not draggable' },
    options: {
      duration: Number(duration.value),
      drag: {
        disabled: !draggable.value,
        direction: resolvedDirection.value,
      },
      threshold: { distance: Number(distance.value) },
      animation: { snap: { duration: Number(snapDuration.value) } },
    },
  })
}
</script>
