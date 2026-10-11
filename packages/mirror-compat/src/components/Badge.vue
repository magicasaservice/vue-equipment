<template>
  <div
    :class="classes"
    :data-mode="mode"
    :data-round="round || undefined"
    :data-size="size"
    :data-square="square || undefined"
    :data-variant="variant"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {
  badgeBase,
  badgeColor,
  badgeHeight,
  badgePadding,
  badgeRadius,
  badgeRoundRadius,
  badgeSquareWidth,
} from '../styles/badge'

import type { MBadgeProps } from '../types/badge'

// Mirror v2 ships no headless badge. There is no state to own, no keyboard
// behaviour and no role, so this stays the plain element v1 rendered.
const {
  variant = 'primary',
  mode = 'solid',
  size = 'md',
  round = false,
  square = false,
} = defineProps<MBadgeProps>()

// Exactly one class per CSS property reaches the element. Two utilities for
// the same property would be resolved by the order Tailwind emits them in
// rather than by the order they sit in this list, so the branches pick.
const classes = computed(() => {
  const out = [badgeBase, badgeHeight[size]]

  out.push(round ? badgeRoundRadius : badgeRadius[size])
  out.push(square ? badgeSquareWidth[size] : badgePadding[size])
  out.push(badgeColor[variant][mode])

  return out
})
</script>

<style>
/*
 * The type ramp and the symbol ramp, the two things v1’s `badge.css` set that
 * no generated utility expresses. `type-component-*` carries the text face at
 * 140% leading and no tracking, and a badge wants the number face at 100% with
 * the number tracking, so the whole block reads the application variables the
 * utilities read.
 *
 * Unscoped, and rooted at `.m-badge`, because the slot content carries the
 * parent’s scope id rather than ours and a scoped selector would never reach
 * the icons.
 */
.m-badge {
  --m-badge-font-size: var(--app-font-size-text-xs);
  --m-badge-symbol: calc(var(--spacing) * 3.75);

  font-family: var(--app-font-family-number);
  font-size: var(--m-badge-font-size);
  font-weight: var(--app-font-weight-text-strong);
  letter-spacing: var(--app-letter-spacing-number);
  line-height: var(--app-line-height-none);
  text-transform: var(--app-text-case);
}

.m-badge[data-size='xs'] {
  --m-badge-font-size: var(--app-font-size-text-3xs);
  --m-badge-symbol: calc(var(--spacing) * 2.25);
}

.m-badge[data-size='sm'] {
  --m-badge-font-size: var(--app-font-size-text-2xs);
  --m-badge-symbol: calc(var(--spacing) * 3);
}

.m-badge[data-size='md'] {
  --m-badge-font-size: var(--app-font-size-text-xs);
  --m-badge-symbol: calc(var(--spacing) * 3.75);
}

.m-badge[data-size='lg'] {
  --m-badge-font-size: var(--app-font-size-text-sm);
  --m-badge-symbol: calc(var(--spacing) * 4.5);
}

.m-badge svg {
  inline-size: var(--m-badge-symbol);
  block-size: var(--m-badge-symbol);
}
</style>
