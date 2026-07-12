<template>
  <div class="flex w-full gap-2">
    <m-button @click="onClick">Add Toast</m-button>
    <m-select
      v-model="position"
      :options="positionOptions"
      label="Position"
      placeholder="Position"
    />
    <m-select
      v-model="direction"
      :options="directionOptions"
      label="Drag direction"
      placeholder="Drag direction"
    />
  </div>
  <magic-toast-provider
    id="magic-toast-drag-direction-demo"
    :options="{
      position,
      drag: { direction: resolvedDirection },
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
import { computed, defineAsyncComponent, ref } from 'vue'
import { MButton, MSelect } from '@maas/mirror/vue'
import { useMagicToast } from '@maas/vue-equipment/plugins/MagicToast'

const component = defineAsyncComponent(
  () => import('./components/DemoToast.vue')
)
const { add } = useMagicToast('magic-toast-drag-direction-demo')

const position = ref('bottom-right')
const direction = ref('left-right')

const positionOptions = [
  { value: 'top-right', label: 'Top Right' },
  { value: 'top', label: 'Top' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'left', label: 'Left' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'right', label: 'Right' },
]

const directionOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
  { value: 'left-right', label: 'Left & Right' },
  { value: 'up-down', label: 'Up & Down' },
]

// MSelect only supports a single value, so the same-axis pairs are
// offered as presets here and expanded into an array for the option.
const resolvedDirection = computed(() => {
  if (direction.value === 'left-right') {
    return ['left', 'right'] as const
  }

  if (direction.value === 'up-down') {
    return ['up', 'down'] as const
  }

  return direction.value
})

// Mirrors the fallback in useToastDrag: when direction is 'auto',
// the actual drag axis/side is derived from the anchor position.
const messageDirection = computed(() => {
  if (direction.value === 'left-right') {
    return 'left or right'
  }

  if (direction.value === 'up-down') {
    return 'up or down'
  }

  if (direction.value !== 'auto') {
    return direction.value
  }

  switch (position.value) {
    case 'top':
    case 'top-left':
    case 'top-right':
      return 'up'
    case 'bottom':
    case 'bottom-left':
    case 'bottom-right':
      return 'down'
    case 'left':
      return 'left'
    case 'right':
      return 'right'
    default:
      return direction.value
  }
})

function onClick() {
  add({
    component,
    props: { message: `Drag me ${messageDirection.value} to dismiss` },
  })
}
</script>
