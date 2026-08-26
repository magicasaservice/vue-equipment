<template>
  <div
    :class="[
      'm-menu-item-child',
      `-${mappedSize}`,
      `-${mappedMode}`,
      {
        '-start': start,
        '-end': end,
        '-label': $slots.end,
        '-spread': spread,
        '-truncate': truncate,
      },
    ]"
  >
    <div v-if="!$slots.end">
      <slot />
    </div>
    <div v-else>
      <span>
        <slot />
      </span>
      <span v-if="$slots.end">
        <slot name="end" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, toValue, type MaybeRef } from 'vue'

// Presentational, no Mirror import
interface MMenuItemChildProps {
  start?: boolean
  end?: boolean
  spread?: boolean
  truncate?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const {
  start = false,
  end = false,
  spread = false,
  truncate = false,
  size,
} = defineProps<MMenuItemChildProps>()

const itemSize = inject<MaybeRef<MMenuItemChildProps['size']>>(
  'm-menu-item-size',
  'md'
)

const mode = inject<MaybeRef<'ghost' | 'subtle'>>('m-menu-item-mode', 'ghost')

const mappedSize = computed(() => size ?? toValue(itemSize))

const mappedMode = computed(() => toValue(mode))
</script>
