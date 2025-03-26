<template>
  <div class="flex flex-col gap-4 items-center">
    <magic-pie
      id="magic-pie-default-demo"
      class="w-16 border-2 rounded-full border-surface"
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
import { MButton, MBadge } from '@maas/mirror/vue'
import { useMagicPie } from '@maas/vue-equipment/plugins'
import { computed } from 'vue'

const {
  percentage,
  setPercentage,
  interpolatePercentage,
  cancelInterpolatePercentage,
} = useMagicPie('magic-pie-default-demo')

function start() {
  if (percentage.value === 100) {
    setPercentage(0)
  }

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
</script>

<style>
[data-id='magic-pie-default-demo'] {
  --magic-pie-background: theme(
    'backgroundColor.surface.elevation.high.DEFAULT'
  );
}
</style>
