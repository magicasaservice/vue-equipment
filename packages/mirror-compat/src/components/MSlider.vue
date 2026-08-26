<template>
  <slider-root
    v-slot="{ percentages }"
    :class="['m-slider', { '-disabled': disabled }]"
    :disabled="disabled"
    :max="mappedMax"
    :min="mappedMin"
    :model-value="mappedValue"
    :step="mappedStep"
    @update:model-value="onUpdate"
  >
    <slider-control
      :class="['m-slider__container', { '-dragging': dragging }]"
      @pointerdown="onPointerdown"
    >
      <slider-track class="m-slider-track">
        <div class="m-slider-track__container">
          <div class="m-slider-steps">
            <span v-for="entry in stepsCount" :key="entry" />
          </div>
          <div
            class="m-slider-range"
            :style="{ clipPath: clip(percentages[0] ?? 0) }"
          >
            <div class="m-slider-range__fill" />
            <div class="m-slider-steps -active">
              <span v-for="entry in stepsCount" :key="entry" />
            </div>
          </div>
        </div>
        <slider-thumb as="div" class="m-slider-handle">
          <div class="m-slider-handle__fill" />
        </slider-thumb>
      </slider-track>
      <div class="m-slider__target" />
    </slider-control>
  </slider-root>
</template>

<script lang="ts" setup>
/* eslint-disable vue/no-required-prop-with-default -- v1's shape, verbatim */
import { computed, ref, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import {
  SliderControl,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from '@maas/mirror/vue'

// `ISliderProps`, verbatim
interface MSliderProps {
  modelValue: string | number
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  steps?: {
    label: string
    value: number | string
  }[]
}

const {
  modelValue = '',
  disabled = false,
  min = 0,
  max = 100,
  step = 1,
  steps,
} = defineProps<MSliderProps>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: MSliderProps['modelValue']): void
  (e: 'dragging', value: boolean): void
}>()

// Private state
const dragging = ref(false)

// Public state
const mappedSteps = computed(() => steps ?? [])

const stepsCount = computed(() => mappedSteps.value.length)

const mappedMin = computed(() => (stepsCount.value ? 0 : (min ?? 0)))

const mappedMax = computed(() =>
  stepsCount.value ? stepsCount.value - 1 : (max ?? 100)
)

const mappedStep = computed(() => (stepsCount.value ? 1 : (step ?? 1)))

// `Slider` is numeric only, so `steps` is mapped to an index on the way in and
// back to the consumer's value on the way out, the same mapping v1 did
// internally, one level up
const mappedValue = computed(() => {
  if (stepsCount.value) {
    return mappedSteps.value.findIndex((entry) => entry.value === modelValue)
  }

  const converted = Number(modelValue)

  return Number.isNaN(converted) ? mappedMin.value : converted
})

// Private functions
function clip(percentage: number) {
  return `inset(0% ${100 - percentage}% 0% 0%)`
}

function onPointerdown() {
  if (disabled) {
    return
  }

  dragging.value = true
}

function onUpdate(value: number | Array<number>) {
  const next = Array.isArray(value) ? (value[0] ?? 0) : value

  if (stepsCount.value) {
    const entry = mappedSteps.value[next]

    if (entry) {
      emit('update:modelValue', entry.value)
    }

    return
  }

  emit('update:modelValue', next)
}

useEventListener('pointerup', () => (dragging.value = false))
useEventListener('pointercancel', () => (dragging.value = false))

// Watch for changes in `dragging` and emit `dragging` event
watch(dragging, (value) => {
  emit('dragging', value)
})
</script>
