<template>
  <div
    :class="[
      'm-menu-item',
      `-${mappedMode}`,
      `-${mappedSize}`,
      {
        '-slot-start': !!$slots.start,
        '-slot-end': !!$slots.end,
        '-disabled': !!disabled,
        '-selected': !!selected,
      },
    ]"
    @keydown="onKeydown"
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

// Presentational, no Mirror import, plus the one bespoke emit in the set
interface MMenuItemProps {
  mode?: 'ghost' | 'subtle'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  selected?: boolean
  disabled?: boolean
}

const { mode, size, selected, disabled } = defineProps<MMenuItemProps>()

const emit = defineEmits<{
  (e: 'enter'): void
}>()

const boxSize = inject<MaybeRef<MMenuItemProps['size']>>(
  'm-menu-box-size',
  undefined
)

// Public state
const mappedSize = computed(() => size ?? toValue(boxSize) ?? 'md')

const mappedMode = computed(() => mode ?? 'ghost')

// Private functions
// v1 registered `onKeyStroke('Enter')` with no target, so every Enter anywhere
// in the document fired `@enter` on every mounted item whose `selected` was
// true. The listener is scoped to the item here; see the migration notes
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter') {
    return
  }

  if (!disabled && selected) {
    emit('enter')
  }
}

provide('m-menu-item-size', mappedSize)
provide('m-menu-item-mode', mappedMode)
</script>
