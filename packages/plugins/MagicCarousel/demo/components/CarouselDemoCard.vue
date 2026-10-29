<template>
  <div
    :class="[
      'bg-surface-base text-surface flex h-full w-full flex-col justify-between',
      size === 'sm' ? 'rounded-md p-2' : 'rounded-surface-md p-5',
    ]"
  >
    <i-maas-maas-robot-500
      :class="['text-surface-subtle', size === 'sm' ? 'h-3 w-3' : 'h-5 w-5']"
    />
    <span :class="size === 'sm' ? 'text-xs' : 'text-4xl'">{{ index }}</span>
  </div>
</template>

<script lang="ts" setup>
interface CarouselDemoCardProps {
  index: number
  size?: 'sm' | 'md'
}

const { index, size = 'md' } = defineProps<CarouselDemoCardProps>()
</script>
