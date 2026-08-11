<template>
  <div
    class="magic-dot-matrix"
    :data-id="toValue(id)"
    :data-playing="state.playing"
    :style="{ '--mdm-cols': mappedCols, '--mdm-rows': mappedRows }"
  >
    <svg xmlns="http://www.w3.org/2000/svg">
      <rect
        v-for="dot in dots"
        :key="dot"
        class="magic-dot-matrix__dot"
        :data-active="activeIndices.has(dot) || null"
        :style="dotStyle(dot)"
      />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, toValue, watch, type MaybeRef } from 'vue'
import { useDotMatrixState } from '../composables/private/useDotMatrixState'
import { useDotMatrixApi } from '../composables/private/useDotMatrixApi'
import { defaultOptions } from '../utils/defaultOptions'
import type { DotMatrixSequence, MagicDotMatrixOptions } from '../types/index'

interface MagicDotMatrixProps {
  id: MaybeRef<string>
  sequence: DotMatrixSequence
  options?: MagicDotMatrixOptions
}

const { id, sequence, options } = defineProps<MagicDotMatrixProps>()

const { initializeState } = useDotMatrixState(id)
const state = initializeState(options)

watch(
  () => options,
  (value) => {
    initializeState(value)
  },
  { deep: true }
)

const { activeIndices, initialize } = useDotMatrixApi({
  instanceId: id,
  sequence: () => sequence,
})

const mappedCols = computed(() => state.options.cols ?? defaultOptions.cols)
const mappedRows = computed(() => state.options.rows ?? defaultOptions.rows)

const dots = computed(() =>
  Array.from(
    { length: mappedCols.value * mappedRows.value },
    (_, index) => index
  )
)

function dotStyle(index: number) {
  return {
    '--mdm-col': index % mappedCols.value,
    '--mdm-row': Math.floor(index / mappedCols.value),
  }
}

onMounted(() => {
  initialize()
})
</script>

<style>
.magic-dot-matrix {
  display: block;
  container-type: inline-size;
}

.magic-dot-matrix svg {
  --mdm-gap: var(
    --magic-dot-matrix-gap,
    calc(100cqi / (4 * var(--mdm-cols) - 1))
  );
  --mdm-dot-size: calc(
    (100cqi - (var(--mdm-cols) - 1) * var(--mdm-gap)) / var(--mdm-cols)
  );
  display: block;
  width: 100cqi;
  height: calc(
    var(--mdm-rows) * var(--mdm-dot-size) + (var(--mdm-rows) - 1) *
      var(--mdm-gap)
  );
  background: var(--magic-dot-matrix-background, transparent);
}

.magic-dot-matrix__dot {
  x: calc(var(--mdm-col) * (var(--mdm-dot-size) + var(--mdm-gap)));
  y: calc(var(--mdm-row) * (var(--mdm-dot-size) + var(--mdm-gap)));
  width: var(--mdm-dot-size);
  height: var(--mdm-dot-size);
  rx: calc(var(--magic-dot-matrix-radius, 0.33) * var(--mdm-dot-size));
  fill: var(
    --magic-dot-matrix-inactive-color,
    color-mix(in srgb, currentColor 15%, transparent)
  );
  transition: var(--magic-dot-matrix-transition, none);
}

.magic-dot-matrix__dot[data-active='true'] {
  fill: var(--magic-dot-matrix-color, currentColor);
}
</style>
