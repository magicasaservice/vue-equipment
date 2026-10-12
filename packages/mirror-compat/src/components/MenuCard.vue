<template>
  <div
    :class="classes"
    :data-disabled="disabled || undefined"
    :data-selected="selected || undefined"
    :data-size="mappedSize"
    :data-slot-end="!!slots.end || undefined"
    :data-slot-start="!!slots.start || undefined"
  >
    <div v-if="slots.start" class="m-menu-card__start">
      <slot name="start" />
    </div>
    <div class="m-menu-card__label">
      <slot />
    </div>
    <div v-if="slots.end" class="m-menu-card__end">
      <slot name="end" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, provide, toValue, useSlots } from 'vue'
import {
  menuCardBase,
  menuCardColor,
  menuCardDisabledColor,
  menuCardSelectedColor,
  menuCardSize,
} from '../styles/menu-card'
import { MenuBoxSizeKey } from '../types/menu-box'
import { MenuCardSizeKey } from '../types/menu-card'

import type { MMenuCardProps } from '../types/menu-card'

const {
  size,
  selected = false,
  disabled = false,
} = defineProps<MMenuCardProps>()

const slots = useSlots()

// A card with no size of its own follows the box it sits in, and falls back to
// v1’s default when there is no box.
const boxSize = inject(MenuBoxSizeKey, undefined)

const mappedSize = computed(() => size ?? toValue(boxSize) ?? 'md')

provide(MenuCardSizeKey, mappedSize)

// Exactly one class per CSS property reaches the element. Two utilities for
// the same property would be resolved by the order Tailwind emits them in
// rather than by the order they sit in this list, so the branch picks.
const classes = computed(() => {
  const out = [menuCardBase, menuCardSize[mappedSize.value]]

  if (disabled) {
    out.push(menuCardDisabledColor)
  } else {
    out.push(selected ? menuCardSelectedColor : menuCardColor)
  }

  return out
})
</script>

<style>
/*
 * The port of v1’s `menu-card.css`. Component tokens become the application
 * variables they resolved to, modifier classes become the data attributes the
 * card writes, and the structural selectors carry over unchanged.
 *
 * Unscoped, and every selector rooted at `.m-menu-card`, because slot content
 * carries the calling component’s scope id rather than this one’s. That is
 * also why the colours of `.m-menu-card-child` live here: they depend on the
 * card’s hover, selected and disabled state, and no utility can look up the
 * tree.
 *
 * Nothing here sets a property the class list sets, so stylesheet order does
 * not matter.
 */
.m-menu-card {
  --m-menu-card-gap: calc(var(--spacing) * 4.5);
  --m-menu-card-padding-label: calc(var(--spacing) * 1.5);
  --m-menu-card-font-size-cmd: var(--app-font-size-text-lg);
}

.m-menu-card[data-size='xs'] {
  --m-menu-card-gap: calc(var(--spacing) * 3.5);
  --m-menu-card-padding-label: calc(var(--spacing) * 0.5);
  --m-menu-card-font-size-cmd: var(--app-font-size-text-sm);
}

.m-menu-card[data-size='sm'] {
  --m-menu-card-gap: calc(var(--spacing) * 4);
  --m-menu-card-padding-label: var(--spacing);
  --m-menu-card-font-size-cmd: var(--app-font-size-text-md);
}

.m-menu-card[data-size='md'] {
  --m-menu-card-gap: calc(var(--spacing) * 4.5);
  --m-menu-card-padding-label: calc(var(--spacing) * 1.5);
  --m-menu-card-font-size-cmd: var(--app-font-size-text-lg);
}

.m-menu-card[data-size='lg'] {
  --m-menu-card-gap: calc(var(--spacing) * 5);
  --m-menu-card-padding-label: calc(var(--spacing) * 2);
  --m-menu-card-font-size-cmd: var(--app-font-size-text-xl);
}

.m-menu-card .m-menu-card__start {
  display: flex;
  align-items: center;
}

.m-menu-card .m-menu-card__label {
  display: inline-flex;
  height: 100%;
  flex: 1;
  align-items: center;
  overflow: hidden;
}

/*
 * With nothing in the start slot the label carries the inset the start slot
 * would have taken, so a column of cards with and without icons keeps one
 * optical left edge.
 */
.m-menu-card:not([data-slot-start='true']) .m-menu-card__label {
  padding-left: calc(var(--m-menu-card-gap) + var(--m-menu-card-padding-label));
}

/*
 * The command wrapper. Family and weight are the card’s, so inheritance
 * delivers them; the size steps one place further up the ramp than the label,
 * and the line height is tighter.
 */
.m-menu-card .m-menu-card__end {
  display: flex;
  align-items: center;
  font-size: var(--m-menu-card-font-size-cmd);
  font-variant-numeric: lining-nums tabular-nums;
  line-height: var(--app-line-height-none);
}

/*
 * Two lines in the label slot, laid out two ways. Without a start slot the
 * wrapper drops out of flex so the second line sits under the first on its own
 * baseline; with one it wraps instead, so the block stays beside the icon.
 */
.m-menu-card:not([data-slot-start='true'])
  .m-menu-card__label
  .m-menu-card-child__content {
  display: inline;
  overflow: hidden;
}

.m-menu-card:not([data-slot-start='true'])
  .m-menu-card__label
  .m-menu-card-child__content
  > span {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-menu-card:not([data-slot-start='true'])
  .m-menu-card__label
  .m-menu-card-child__content
  > span:last-child {
  padding-top: var(--m-menu-card-child-gap-label);
}

.m-menu-card[data-slot-start='true']
  .m-menu-card__label
  .m-menu-card-child__content {
  flex-wrap: wrap;
  gap: var(--m-menu-card-child-gap-label);
  overflow: hidden;
}

.m-menu-card[data-slot-start='true']
  .m-menu-card__label
  .m-menu-card-child__content
  > span {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Label colour, and the muted second line under it. */
.m-menu-card:not([data-disabled='true']) .m-menu-card-child__content {
  color: var(--app-color-primary-fg-on-subtle);
}

.m-menu-card:not([data-disabled='true'])
  .m-menu-card-child__content
  > span:last-child:not(:first-child) {
  color: var(--app-color-primary-fg-muted);
}

.m-menu-card[data-disabled='true'] .m-menu-card-child__content {
  color: var(--app-color-disabled-fg-on-subtle);
}

.m-menu-card[data-disabled='true']
  .m-menu-card-child__content
  > span:last-child:not(:first-child) {
  color: var(--app-color-disabled-fg-muted);
}

/* Command colour. */
.m-menu-card:not([data-disabled='true'])
  .m-menu-card-child[data-end='true']
  .m-menu-card-child__content,
.m-menu-card:not([data-disabled='true'])
  .m-menu-card-child[data-end='true']
  .m-menu-card-child__content
  > span:first-child {
  color: var(--app-color-primary-fg-muted);
}

.m-menu-card:not([data-disabled='true']):hover
  .m-menu-card-child[data-end='true']
  .m-menu-card-child__content,
.m-menu-card:not([data-disabled='true']):hover
  .m-menu-card-child[data-end='true']
  .m-menu-card-child__content
  > span:first-child,
.m-menu-card:not([data-disabled='true']):active
  .m-menu-card-child[data-end='true']
  .m-menu-card-child__content,
.m-menu-card:not([data-disabled='true']):active
  .m-menu-card-child[data-end='true']
  .m-menu-card-child__content
  > span:first-child,
.m-menu-card:not([data-disabled='true'])[data-selected='true']
  .m-menu-card-child[data-end='true']
  .m-menu-card-child__content,
.m-menu-card:not([data-disabled='true'])[data-selected='true']
  .m-menu-card-child[data-end='true']
  .m-menu-card-child__content
  > span:first-child {
  color: var(--app-color-primary-fg-solid);
}

/*
 * Disabled keeps one command colour through every state. v1 reached for a
 * hover token on hover and while selected, but `menuCard` never declared one,
 * so the declaration dropped and the muted colour stood.
 */
.m-menu-card[data-disabled='true']
  .m-menu-card-child[data-end='true']
  .m-menu-card-child__content,
.m-menu-card[data-disabled='true']
  .m-menu-card-child[data-end='true']
  .m-menu-card-child__content
  > span:first-child {
  color: var(--app-color-disabled-fg-muted);
}
</style>
