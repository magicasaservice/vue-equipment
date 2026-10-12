<template>
  <MirrorButton
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-blur="blur || undefined"
    :data-icon="icon || undefined"
    :data-icon-end="iconEnd || undefined"
    :data-icon-start="iconStart || undefined"
    :data-inline="inline || undefined"
    :data-mode="mode"
    :data-selected="selected || undefined"
    :data-size="size"
    :data-square="square || undefined"
    :data-variant="variant"
    :disabled="disabled"
    :type="type"
  >
    <slot />
  </MirrorButton>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Button as MirrorButton } from '@maas/mirror/vue/Button'
import {
  buttonBase,
  buttonBlockWidth,
  buttonColor,
  buttonDisabledColor,
  buttonInlineRadius,
  buttonInlineSize,
  buttonInlineSquareWidth,
  buttonRadius,
  buttonRoundRadius,
  buttonSelectedColor,
  buttonSize,
  buttonSquareWidth,
} from '../styles/button'

import type { MButtonProps } from '../types/button'

const {
  as = 'button',
  variant = 'primary',
  mode = 'solid',
  size = 'md',
  type = 'button',
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

// Exactly one class per CSS property reaches the element. Two utilities for
// the same property would be resolved by the order Tailwind emits them in
// rather than by the order they sit in this list, so the branches pick.
const classes = computed(() => {
  const out = [buttonBase]

  out.push(inline ? buttonInlineSize[size] : buttonSize[size])

  if (round) {
    out.push(buttonRoundRadius)
  } else {
    out.push(inline ? buttonInlineRadius[size] : buttonRadius[size])
  }

  if (block) {
    out.push(buttonBlockWidth)
  } else if (square) {
    out.push(inline ? buttonInlineSquareWidth[size] : buttonSquareWidth[size])
  }

  if (disabled) {
    out.push(buttonDisabledColor[mode])
  } else if (selected) {
    out.push(buttonSelectedColor[variant][mode])
  } else {
    out.push(buttonColor[variant][mode])
  }

  return out
})
</script>

<style>
/*
 * Geometry v1 wrote as a calc, plus the rules that key off where an svg sits
 * in the slot. No generated utility expresses either, so both read the
 * application variables directly. The block is deliberately unscoped: slot
 * content carries the parent’s scope id, not ours, so a scoped selector would
 * never reach the icons. Every selector is rooted at `.m-button` instead.
 *
 * Nothing here sets a property the class list also sets, so it does not
 * matter whether this rule or a utility lands later in the stylesheet.
 */
.m-button {
  --m-button-padding: calc(var(--spacing) * 4);
  --m-button-padding-label: 4px;
  --m-button-symbol: calc(var(--spacing) * 4.5);
  --m-button-symbol-icon: calc(var(--spacing) * 5.5);
  --m-button-blur: 4rem;

  padding-inline: calc(
    var(--m-button-padding) + var(--m-button-padding-label) -
      var(--app-dimension-border)
  );
}

.m-button[data-size='xs'] {
  --m-button-padding: calc(var(--spacing) * 2);
  --m-button-symbol: calc(var(--spacing) * 3.5);
  --m-button-symbol-icon: calc(var(--spacing) * 4.5);
}

.m-button[data-size='sm'] {
  --m-button-padding: calc(var(--spacing) * 3);
  --m-button-symbol: calc(var(--spacing) * 4);
  --m-button-symbol-icon: calc(var(--spacing) * 5);
}

.m-button[data-size='md'] {
  --m-button-padding: calc(var(--spacing) * 4);
  --m-button-symbol: calc(var(--spacing) * 4.5);
  --m-button-symbol-icon: calc(var(--spacing) * 5.5);
}

.m-button[data-size='lg'] {
  --m-button-padding: calc(var(--spacing) * 5);
  --m-button-symbol: calc(var(--spacing) * 5);
  --m-button-symbol-icon: calc(var(--spacing) * 6);
}

.m-button[data-inline='true'][data-size='xs'] {
  --m-button-padding: var(--spacing);
}

.m-button[data-inline='true'][data-size='sm'] {
  --m-button-padding: calc(var(--spacing) * 2);
}

.m-button[data-inline='true'][data-size='md'] {
  --m-button-padding: calc(var(--spacing) * 3);
}

.m-button[data-inline='true'][data-size='lg'] {
  --m-button-padding: calc(var(--spacing) * 4);
}

.m-button[data-square='true'] {
  padding-inline: 0;
}

.m-button:not([data-icon='true']):not([data-square='true']):is(
    :has(svg:first-child),
    [data-icon-start='true']
  ) {
  padding-left: calc(var(--m-button-padding) - var(--app-dimension-border));
}

.m-button:not([data-icon='true']):not([data-square='true']):is(
    :has(svg:last-child),
    [data-icon-end='true']
  ) {
  padding-right: calc(var(--m-button-padding) - var(--app-dimension-border));
}

.m-button:not([data-icon='true']) svg:first-child {
  inline-size: var(--m-button-symbol);
  block-size: var(--m-button-symbol);
  margin-right: var(--m-button-padding-label);
}

.m-button:not([data-icon='true']) svg:last-child {
  inline-size: var(--m-button-symbol);
  block-size: var(--m-button-symbol);
  margin-left: var(--m-button-padding-label);
}

.m-button[data-icon='true'] svg {
  inline-size: var(--m-button-symbol-icon);
  block-size: var(--m-button-symbol-icon);
  margin-inline: 0;
}

.m-button[data-blur='true'][data-mode='subtle'],
.m-button[data-blur='true'][data-mode='ghost']:hover,
.m-button[data-blur='true'][data-mode='ghost']:active {
  backdrop-filter: blur(var(--m-button-blur));
}
</style>
