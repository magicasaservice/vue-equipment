<template>
  <div
    class="bg-surface-base text-surface rounded-surface-md flex h-full w-full flex-col justify-between p-5"
  >
    <i-maas-maas-robot-500 class="text-surface-subtle h-5 w-5" />
    <span class="text-4xl">{{ index }}</span>
  </div>
</template>

<script lang="ts" setup>
interface CarouselDemoCardProps {
  index: number
}

const { index } = defineProps<CarouselDemoCardProps>()
</script>
