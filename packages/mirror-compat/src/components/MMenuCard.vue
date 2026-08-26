<template>
  <div
    :class="[
      'm-menu-card',
      `-${mappedSize}`,
      {
        '-slot-start': !!$slots.start,
        '-slot-end': !!$slots.end,
        '-disabled': !!disabled,
        '-selected': !!selected,
      },
    ]"
  >
    <div v-if="$slots.start">
      <slot name="start" />
    </div>
    <div>
      <slot />
    </div>
    <div v-if="$slots.end">
      <slot name="end" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, provide, toValue, type MaybeRef } from 'vue'

// Presentational, no Mirror import
interface MMenuCardProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  selected?: boolean
  disabled?: boolean
}

const { size, selected, disabled } = defineProps<MMenuCardProps>()

const boxSize = inject<MaybeRef<MMenuCardProps['size']>>(
  'm-menu-box-size',
  undefined
)

const mappedSize = computed(() => size ?? toValue(boxSize) ?? 'md')

provide('m-menu-card-size', mappedSize)
</script>
