<template>
  <button-root
    :class="[
      'm-button',
      `-${variant}`,
      `-${mode}`,
      `-${size}`,
      {
        '-square': square,
        '-round': round,
        '-icon': icon,
        '-icon-start': iconStart,
        '-icon-end': iconEnd,
        '-block': block,
        '-blur': blur,
        '-selected': selected,
        '-disabled': disabled,
        '-inline': inline,
      },
    ]"
    :as="as"
    :as-child="asChild"
    :data-selected="selected || undefined"
    :disabled="disabled"
    :native-button="as === 'button' && !asChild"
    :type="type"
  >
    <slot />
  </button-root>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import { Button as ButtonRoot } from '@maas/mirror/vue'

// `IButtonProps`, verbatim
interface MButtonProps {
  as?: 'a' | 'button' | 'div' | 'span' | Component
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger'
  mode?: 'solid' | 'tone' | 'translucent' | 'ghost' | 'outline' | 'plain'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  asChild?: boolean
  icon?: boolean
  iconStart?: boolean
  iconEnd?: boolean
  square?: boolean
  round?: boolean
  block?: boolean
  selected?: boolean
  disabled?: boolean
  blur?: boolean
  inline?: boolean
}

const {
  variant = 'primary',
  mode = 'solid',
  size = 'md',
  type = 'button',
  as = 'button',
  asChild = false,
  icon = false,
  iconStart = false,
  iconEnd = false,
  square = false,
  round = false,
  block = false,
  selected = false,
  disabled = false,
  blur = false,
  inline = false,
} = defineProps<MButtonProps>()
</script>
