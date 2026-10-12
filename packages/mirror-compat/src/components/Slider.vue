<template>
  <MirrorSliderRoot
    :class="sliderBase"
    :model-value="mappedValue"
    :options="{
      min: mappedMin,
      max: mappedMax,
      step: mappedStep,
      disabled: disabled || undefined,
    }"
    :data-pointer-focus="pointerFocus || undefined"
    :style="{ '--m-slider-fill': `${fill}%` }"
    @dragging="handleDragging"
    @keydown="handleKeydown"
    @pointerdown="handlePointerDown"
    @update:model-value="handleUpdate"
  >
    <MirrorSliderControl :class="sliderControl">
      <MirrorSliderTrack :class="trackClasses">
        <div v-if="stepsCount" :class="sliderSteps">
          <span v-for="index in stepsCount" :key="index" />
        </div>
        <MirrorSliderIndicator :class="sliderIndicator" />
        <div v-if="stepsCount" :class="sliderSteps" data-active="true">
          <span v-for="index in stepsCount" :key="index" />
        </div>
        <MirrorSliderThumb :class="sliderThumb">
          <span :class="sliderHandle" />
        </MirrorSliderThumb>
      </MirrorSliderTrack>
      <div :class="sliderTarget" />
    </MirrorSliderControl>
  </MirrorSliderRoot>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  SliderControl as MirrorSliderControl,
  SliderIndicator as MirrorSliderIndicator,
  SliderRoot as MirrorSliderRoot,
  SliderThumb as MirrorSliderThumb,
  SliderTrack as MirrorSliderTrack,
} from '@maas/mirror/vue/Slider'
import {
  sliderBase,
  sliderControl,
  sliderDisabledTrack,
  sliderHandle,
  sliderIndicator,
  sliderSteps,
  sliderTarget,
  sliderThumb,
  sliderTrack,
} from '../styles/slider'

import type { SliderModelValue } from '@maas/mirror/vue/Slider'
import type { MSliderProps } from '../types/slider'

const {
  modelValue,
  disabled = false,
  min = 0,
  max = 100,
  step = 1,
  steps = [],
} = defineProps<MSliderProps>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: MSliderProps['modelValue']): void
  (e: 'dragging', value: boolean): void
}>()

const stepsCount = computed(() => steps.length)

// Named stops become an index between zero and the last one, which is what v1
// handed its own maths. Everything downstream then works in plain numbers.
const mappedMin = computed(() => (stepsCount.value ? 0 : min))

const mappedMax = computed(() =>
  stepsCount.value ? stepsCount.value - 1 : max
)

const mappedStep = computed(() => (stepsCount.value ? 1 : step))

const mappedValue = computed(() => {
  if (stepsCount.value) {
    const index = steps.findIndex((entry) => entry.value === modelValue)

    return index < 0 ? mappedMin.value : index
  }

  const converted = Number(modelValue)

  return Number.isNaN(converted) ? mappedMin.value : converted
})

// The step dots inside the filled range are clipped to this, the way v1 clipped
// its range. The headless indicator works the percentage out again for itself,
// from the same value.
const fill = computed(() => {
  const range = mappedMax.value - mappedMin.value

  if (range <= 0) {
    return 0
  }

  const percentage = ((mappedValue.value - mappedMin.value) / range) * 100

  return Math.min(Math.max(percentage, 0), 100)
})

// The part focuses its thumb from script on pointer down, which Chrome counts
// as visible focus. v1's root took focus from the pointer itself and only
// showed the ring once a key was pressed, so the wrapper keeps the same rule.
const pointerFocus = ref(false)

// The track is the only part whose colour v1 replaced wholesale when disabled,
// and one utility per property means the branch happens here.
const trackClasses = computed(() =>
  disabled ? sliderDisabledTrack : sliderTrack
)

// Private functions
function handleUpdate(value: SliderModelValue) {
  const next = Array.isArray(value) ? (value[0] ?? mappedMin.value) : value

  if (stepsCount.value) {
    const entry = steps[next]

    if (entry) {
      emit('update:modelValue', entry.value)
    }

    return
  }

  emit('update:modelValue', next)
}

function handleDragging(value: boolean) {
  emit('dragging', value)
}

function handlePointerDown() {
  pointerFocus.value = true
}

function handleKeydown() {
  pointerFocus.value = false
}
</script>

<style>
/*
 * The port of v1’s `slider.css`. Component tokens become the application
 * variables they resolved to, the modifier classes become the data attributes
 * v2’s parts already write, and the four dimensions the apps override are
 * read with a fallback and never declared here, so an override wins wherever
 * it lands in the stylesheet.
 *
 * Two things v1 drew are gone because they were never visible: the track and
 * the handle each carried a 1px transparent border, and the range and the step
 * rows were then offset by that same pixel to cover it again. The painted
 * result is identical without either.
 *
 * Unscoped, and every selector rooted at `.m-slider`, because each headless
 * part carries its own scope id rather than this component’s.
 */
.m-slider {
  --m-slider-track-height: var(--spacing);
  --m-slider-step-radius: calc(var(--spacing) * 4);

  /*
   * The thumb box is a point, so its centre lands exactly on the percentage,
   * which is where v1’s `margin-left` put it. The container’s padding is what
   * keeps the handle inside the control at either end, again as in v1. The
   * unit is not optional: the part subtracts this from a percentage, and
   * `calc(100% - 0)` is invalid where `calc(100% - 0px)` is not.
   */
  --mirror-slider-thumb-size: 0px;
  --mirror-slider-track-size: var(--m-slider-track-height);
}

.m-slider .m-slider__container {
  --mirror-slider-cursor: grab;

  padding-inline: calc(var(--spacing) * 3.75 / 2);
}

/* v1: `dimension.target`, half a default handle taller than the row. */
.m-slider .m-slider__target {
  position: absolute;
  top: 50%;
  height: calc(var(--spacing) * 8 + var(--spacing) * 3.75 / 2);
  width: 100%;
  transform: translateY(-50%);
}

.m-slider .m-slider__range {
  background: var(--app-color-primary-fg-solid);
}

.m-slider[data-disabled='true'] .m-slider__range {
  background: var(--app-color-disabled-fg-solid);
}

.m-slider .m-slider__handle-fill {
  position: absolute;
  top: 50%;
  left: 50%;
  height: var(--m-slider-handle-height, calc(var(--spacing) * 3.75));
  width: var(--m-slider-handle-width, calc(var(--spacing) * 3.75));
  background: var(--app-color-primary-fg-solid);
  outline-color: transparent;
  outline-style: solid;
  outline-width: var(--app-dimension-outline-focus);
  transform: translate(-50%, -50%);
}

.m-slider[data-dragging='true'] .m-slider__handle-fill {
  height: var(--m-slider-handle-pressed-height, calc(var(--spacing) * 4.25));
  width: var(--m-slider-handle-pressed-width, calc(var(--spacing) * 4.25));
}

.m-slider[data-disabled='true'] .m-slider__handle-fill {
  background: var(--app-color-disabled-fg-solid);
}

/* The focus ring is an outline, which has no utility, so it lives here. */
.m-slider .m-slider__handle:focus-visible {
  outline: none;
}

.m-slider:not([data-pointer-focus='true'])
  .m-slider__handle:focus-visible
  .m-slider__handle-fill {
  outline-color: var(--app-color-focus-outline);
  outline-offset: 0;
}

.m-slider .m-slider__steps {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* The filled row is clipped to the value, which is what v1’s range did. */
.m-slider .m-slider__steps[data-active='true'] {
  clip-path: inset(0 calc(100% - var(--m-slider-fill, 0%)) 0 0);
}

.m-slider .m-slider__steps span {
  height: calc(var(--m-slider-track-height) - calc(var(--spacing) * 0.25));
  width: calc(var(--m-slider-track-height) - calc(var(--spacing) * 0.25));
  border-radius: var(--m-slider-step-radius);
  background: var(--app-color-primary-fg-subtle);
  transition: all 100ms linear;
}

.m-slider .m-slider__steps span:first-child,
.m-slider .m-slider__steps span:last-child {
  visibility: hidden;
}

.m-slider .m-slider__steps[data-active='true'] span {
  background: var(--app-color-primary-fg-on-solid);
}

.m-slider[data-disabled='true'] .m-slider__steps span {
  background: var(--app-color-disabled-fg-subtle);
}

.m-slider[data-disabled='true'] .m-slider__steps[data-active='true'] span {
  background: var(--app-color-disabled-fg-on-solid);
}
</style>
