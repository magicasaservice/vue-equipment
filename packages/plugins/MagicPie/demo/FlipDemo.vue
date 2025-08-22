<template>
  <div class="flex flex-col items-center gap-4">
    <magic-pie
      id="magic-pie-flip-demo"
      class="border-surface w-16 rounded-full border-2"
      :options="{ flip }"
    />
    <m-badge>{{ mappedPercentage }}</m-badge>
    <div class="flex gap-2">
      <m-button @click="start">Start</m-button>
      <m-button @click="pause">Pause</m-button>
      <m-button @click="stop">Stop</m-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { MButton, MBadge } from '@maas/mirror/vue'
import { useMagicPie } from '@maas/vue-equipment/plugins/MagicPie'

const flip = ref(false)

const {
  percentage,
  setPercentage,
  interpolatePercentage,
  cancelInterpolatePercentage,
} = useMagicPie('magic-pie-flip-demo')

function start() {
  interpolatePercentage({
    value: 100,
    duration: 2000,
  })
}

function pause() {
  cancelInterpolatePercentage()
}

function stop() {
  if (percentage.value === 100) {
    return
  }

  cancelInterpolatePercentage()
  setPercentage(0)
}

const mappedPercentage = computed(() => {
  return `${Math.round(percentage.value)}%`
})

watch(
  () => percentage.value,
  (value) => {
    if (value === 100) {
      setPercentage(0)
      flip.value = !flip.value
      start()
    }
  }
)
</script>

<style>
[data-id='magic-pie-flip-demo'] {
  --magic-pie-background: var(--app-color-surface-high);
}
</style>
