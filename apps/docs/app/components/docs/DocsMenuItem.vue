<template>
  <component
    :is="tag"
    :to="to"
    :aria-disabled="disabled || undefined"
    class="group inline-flex w-full cursor-pointer items-center justify-start px-1 transition-colors duration-100 ease-linear select-none"
    :class="[
      size_.height,
      size_.gap,
      size_.radius,
      size_.type,
      stateClasses,
      disabled && 'pointer-events-none cursor-not-allowed',
    ]"
  >
    <span
      v-if="$slots.symbol"
      class="flex shrink-0 items-center"
      :class="[size_.symbolPad, size_.symbol]"
    >
      <slot name="symbol" />
    </span>

    <span
      class="inline-flex h-full min-w-0 flex-1 items-center overflow-hidden"
      :class="[$slots.symbol ? '' : size_.labelPad, size_.labelPadEnd]"
    >
      <span class="truncate">
        <slot />
      </span>
    </span>

    <span
      v-if="$slots.cmd"
      class="flex shrink-0 items-center leading-none lining-nums tabular-nums"
      :class="[size_.cmdPad, cmdClasses]"
    >
      <slot name="cmd" />
    </span>
  </component>
</template>

<script setup lang="ts">
/**
 * The v1 `m-menu-item`, rebuilt in Tailwind.
 *
 * Mirror v2 dropped the component and its token group, so the recipe below is
 * the v1 CSS resolved through the v1 tokens and re-expressed as utilities.
 * Nothing here is new design: every number is the value the token carried, and
 * every color is the v2 utility that stands where the v1 reference pointed.
 *
 * ## Geometry, per size
 *
 * | v1 token                       | xs           | sm             | md            | lg             |
 * | ------------------------------ | ------------ | -------------- | ------------- | -------------- |
 * | `dimension.height`             | 2rem `h-8`   | 2.5rem `h-10`  | 3rem `h-12`   | 3.5rem `h-14`  |
 * | `dimension.gap`                | 0.5 `gap-2`  | 0.9375 `3.75`  | 1rem `gap-4`  | 1.0625 `4.25`  |
 * | `dimension.radius`             | `-sm`        | `-md`          | `-lg`         | `-xl`          |
 * | `fontSize.label` / `.cmd`      | `-sm` 13px   | `-md` 14px     | `-lg` 15px    | `-xl` 16px     |
 * | `dimension.symbol`             | 14 `size-3.5`| 16 `size-4`    | 18 `size-4.5` | 20 `size-5`    |
 * | `padding.label`                | 2px          | 4px            | 6px           | 8px            |
 * | label indent (gap + pad.label) | 10 `pl-2.5`  | 19 `pl-4.75`   | 22 `pl-5.5`   | 25 `pl-6.25`   |
 *
 * `padding.container` is `0.25rem` at every size, so the root is `px-1`; the
 * v1 child component added `gap` again on the symbol and on the cmd, which is
 * `symbolPad` / `cmdPad` below. Radius resolves through the same rem values in
 * v2 as in v1 (`--app-dimension-radius-sm` is still `0.75rem`), so the
 * `rounded-component-*` rung is a rename, not a re-pick.
 *
 * ## Color, per state
 *
 * | v1 reference                                | v2 utility               |
 * | ------------------------------------------- | ------------------------ |
 * | `primary.bg.translucent.default`             | `bg-primary-subtle`      |
 * | `primary.bg.translucent.hover`               | `bg-primary-subtle-hover`|
 * | `primary.bg.translucent.active`              | `bg-primary-subtle-active`|
 * | `primary.fg.onTranslucent.default`           | `text-primary-on-subtle` |
 * | `primary.fg.muted.default`                   | `text-primary-muted`     |
 * | `primary.fg.solid.default`                   | `text-primary-solid`     |
 * | `disabled.bg.translucent.default`            | `bg-disabled-subtle`     |
 * | `disabled.fg.onTranslucent.default`          | `text-disabled-on-subtle`|
 * | `disabled.fg.muted.default`                  | `text-disabled-muted`    |
 * | `primary.bg.inverted.default` (menu box)     | `bg-primary-inverted`    |
 *
 * v1's `translucent` ramp was renamed `subtle` in v2 and carries the same
 * alphas (0.12 / 0.18 / 0.24), so the mapping is one to one.
 *
 * Two departures, both deliberate. v1 transitioned `all`; only colors change
 * here, so this transitions `colors` over the same 100ms linear. And v1 was a
 * `div` with no focus state at all; a keyboard focus takes the hover
 * treatment, on top of the outline the docs draw globally.
 */
import { computed, resolveComponent } from 'vue'

interface DocsMenuItemProps {
  as?: string
  to?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  mode?: 'ghost' | 'subtle'
  active?: boolean
  disabled?: boolean
}

const {
  as = 'div',
  to,
  size = 'md',
  mode = 'ghost',
  active = false,
  disabled = false,
} = defineProps<DocsMenuItemProps>()

const tag = computed(() => (to ? resolveComponent('NuxtLink') : as))

const sizes = {
  xs: {
    height: 'h-8',
    gap: 'gap-2',
    radius: 'rounded-component-sm',
    type: 'type-component-sm',
    symbol: '[&_svg]:size-3.5',
    symbolPad: 'pl-2',
    labelPad: 'pl-2.5',
    labelPadEnd: 'pr-0.5',
    cmdPad: 'pr-2',
  },
  sm: {
    height: 'h-10',
    gap: 'gap-3.75',
    radius: 'rounded-component-md',
    type: 'type-component-md',
    symbol: '[&_svg]:size-4',
    symbolPad: 'pl-3.75',
    labelPad: 'pl-4.75',
    labelPadEnd: 'pr-1',
    cmdPad: 'pr-3.75',
  },
  md: {
    height: 'h-12',
    gap: 'gap-4',
    radius: 'rounded-component-lg',
    type: 'type-component-lg',
    symbol: '[&_svg]:size-4.5',
    symbolPad: 'pl-4',
    labelPad: 'pl-5.5',
    labelPadEnd: 'pr-1.5',
    cmdPad: 'pr-4',
  },
  lg: {
    height: 'h-14',
    gap: 'gap-4.25',
    radius: 'rounded-component-xl',
    type: 'type-component-xl',
    symbol: '[&_svg]:size-5',
    symbolPad: 'pl-4.25',
    labelPad: 'pl-6.25',
    labelPadEnd: 'pr-2',
    cmdPad: 'pr-4.25',
  },
} as const

const size_ = computed(() => sizes[size])

/**
 * One background and one foreground per state, assembled here rather than
 * stacked in the template: two color utilities of the same namespace on one
 * element resolve by stylesheet order, which is not something a component may
 * rely on.
 */
const stateClasses = computed(() => {
  if (disabled) {
    if (mode === 'subtle') {
      return active
        ? 'bg-disabled-subtle text-disabled-on-subtle'
        : 'text-disabled-muted'
    }
    return active
      ? 'bg-disabled-subtle text-disabled-on-subtle'
      : 'text-disabled-on-subtle'
  }

  if (mode === 'subtle') {
    if (active) {
      return 'bg-primary-subtle-hover text-primary-on-subtle'
    }
    return 'text-primary-muted hover:bg-primary-subtle-hover hover:text-primary-on-subtle focus-visible:bg-primary-subtle-hover focus-visible:text-primary-on-subtle active:bg-primary-subtle-active'
  }

  if (active) {
    return 'bg-primary-subtle text-primary-on-subtle'
  }
  return 'text-primary-on-subtle hover:bg-primary-subtle focus-visible:bg-primary-subtle active:bg-primary-subtle-hover'
})

// The cmd slot is the one part that moves on its own: muted at rest, solid
// under a pointer and while the row is the current one.
const cmdClasses = computed(() => {
  if (disabled) {
    return active ? 'text-disabled-solid' : 'text-disabled-muted'
  }
  return active
    ? 'text-primary-solid'
    : 'text-primary-muted group-hover:text-primary-solid'
})
</script>
