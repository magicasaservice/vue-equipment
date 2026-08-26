<template>
  <div
    :class="[
      'm-badge',
      `-${variant}`,
      `-${mode}`,
      `-${size}`,
      {
        '-square': square,
        '-round': round,
      },
    ]"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
// `IBadgeProps`, verbatim. Presentational, no Mirror import.
interface MBadgeProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger'
  mode?: 'solid' | 'tone' | 'translucent' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  round?: boolean
  square?: boolean
}

const {
  variant = 'primary',
  mode = 'solid',
  size = 'md',
  round = false,
  square = false,
} = defineProps<MBadgeProps>()
</script>
