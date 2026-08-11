<template>
  <div class="flex w-full flex-col items-center gap-8 py-8">
    <magic-dot-matrix
      id="magic-dot-matrix-presets-demo"
      class="w-24"
      :sequence="sequence"
    />
    <div class="flex max-w-md flex-wrap justify-center gap-2">
      <m-button
        v-for="preset in presets"
        :key="preset.name"
        size="sm"
        :mode="preset.name === selected ? 'solid' : 'translucent'"
        @click="select(preset.name)"
      >
        {{ preset.name }}
      </m-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { MButton } from '@maas/mirror/vue'
import {
  createCheckerboard,
  createDrift,
  createFocus,
  createEqualizer,
  createOrbit,
  createComet,
  createPulse,
  createFill,
  createRipple,
  createScan,
  createSpiral,
  createBounce,
} from '@maas/vue-equipment/plugins/MagicDotMatrix'

const grid = { cols: 7, rows: 7 }

const presets = [
  { name: 'ripple', sequence: createRipple(grid) },
  { name: 'pulse', sequence: createPulse(grid) },
  { name: 'comet', sequence: createComet(grid) },
  { name: 'orbit', sequence: createOrbit(grid) },
  { name: 'scan', sequence: createScan(grid) },
  { name: 'equalizer', sequence: createEqualizer(grid) },
  { name: 'checkerboard', sequence: createCheckerboard(grid) },
  { name: 'focus', sequence: createFocus(grid) },
  { name: 'fill', sequence: createFill(grid) },
  { name: 'spiral', sequence: createSpiral(grid) },
  { name: 'bounce', sequence: createBounce(grid) },
  { name: 'drift', sequence: createDrift(grid) },
]

const selected = ref('ripple')

const sequence = computed(
  () => presets.find((preset) => preset.name === selected.value)?.sequence ?? []
)

function select(name: string) {
  selected.value = name
}
</script>

<style>
[data-id='magic-dot-matrix-presets-demo'] {
  --magic-dot-matrix-radius: 0.5;
}
</style>
