<template>
  <div
    :class="[
      'm-menu-card-child',
      `-${mappedSize}`,
      {
        '-start': start,
        '-end': end,
        '-label': $slots.end,
        '-spread': spread,
      },
    ]"
  >
    <div v-if="!$slots.end">
      <slot />
    </div>
    <template v-else>
      <div>
        <slot />
      </div>
      <span v-if="$slots.end">
        <slot name="end" />
      </span>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, toValue, type MaybeRef } from 'vue'

// Presentational, no Mirror import
interface MMenuCardChildProps {
  start?: boolean
  end?: boolean
  spread?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const {
  start = false,
  end = false,
  spread = false,
  size,
} = defineProps<MMenuCardChildProps>()

const cardSize = inject<MaybeRef<MMenuCardChildProps['size']>>(
  'm-menu-card-size',
  'md'
)

const mappedSize = computed(() => size ?? toValue(cardSize))
</script>
