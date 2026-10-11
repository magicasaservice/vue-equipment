import type { MMenuItemMode, MMenuItemSize } from '../types/menu-item'

/**
 * Every class Mirror v1’s `menu-item.css` reached through a component token,
 * expressed in v2’s generated utilities.
 *
 * The strings are written out in full because Tailwind reads them literally.
 * Never build one by interpolation, and never put two utilities for the same
 * CSS property in the same list: which of the two wins is decided by the order
 * Tailwind emits them in, not by the order they appear on the element. The
 * component composes these maps so exactly one of each reaches the element.
 *
 * v1 painted the label colour on the item and the command colour on the child
 * inside it, through descendant selectors that also read the item’s hover and
 * selected state. A utility cannot look up the tree, so the command colours
 * stay in the component’s CSS block and no colour utility goes on the child.
 */

/** Shape and motion. Carries no size, no colour and no cursor. */
export const menuItemBase =
  'm-menu-item box-border inline-flex w-full items-center justify-start px-1 select-none transition-all duration-100 ease-linear'

/**
 * Height, gap, radius and the type ramp.
 *
 * v1 set the family, weight and line height on the item and the font size on
 * the label wrapper inside it. `type-component-*` carries all four, so the
 * ramp sits on the item and the wrapper inherits it.
 */
export const menuItemSize: Record<MMenuItemSize, string> = {
  xs: 'h-8 gap-2 rounded-component-sm type-component-sm',
  sm: 'h-10 gap-3.75 rounded-component-md type-component-md',
  md: 'h-12 gap-4 rounded-component-lg type-component-lg',
  lg: 'h-14 gap-4.25 rounded-component-xl type-component-xl',
}

export const menuItemCursor = 'cursor-pointer'

export const menuItemDisabledCursor = 'cursor-not-allowed'

/** The resting colour of both modes. */
export const menuItemColor: Record<MMenuItemMode, string> = {
  ghost:
    'bg-transparent text-primary-on-subtle hover:bg-primary-subtle active:bg-primary-subtle-hover',
  subtle:
    'bg-transparent text-primary-muted hover:bg-primary-subtle-hover hover:text-primary-on-subtle active:bg-primary-subtle-active',
}

/**
 * `selected` holds the hover colour while :hover and :active still apply.
 *
 * The resting background is the hover value rather than a `data-[selected]`
 * variant, because Tailwind emits `data-[selected]` after `hover:` and the
 * variant would win over a real hover. That is what v1’s `&:hover, &.-selected`
 * did.
 */
export const menuItemSelectedColor: Record<MMenuItemMode, string> = {
  ghost:
    'bg-primary-subtle text-primary-on-subtle hover:bg-primary-subtle active:bg-primary-subtle-hover',
  subtle:
    'bg-primary-subtle-hover text-primary-on-subtle hover:bg-primary-subtle-hover active:bg-primary-subtle-active',
}

/** Disabled replaces the resting colour and drops hover and active with it. */
export const menuItemDisabledColor: Record<MMenuItemMode, string> = {
  ghost: 'bg-transparent text-disabled-on-subtle',
  subtle: 'bg-transparent text-disabled-muted',
}

/** Disabled and selected. v1 kept the selected background, greyed out. */
export const menuItemDisabledSelectedColor: Record<MMenuItemMode, string> = {
  ghost: 'bg-disabled-subtle text-disabled-on-subtle',
  subtle: 'bg-disabled-subtle text-disabled-on-subtle',
}

/** The child. Everything else about it is structure, and lives in CSS. */
export const menuItemChildBase = 'm-menu-item-child inline-flex items-center'
