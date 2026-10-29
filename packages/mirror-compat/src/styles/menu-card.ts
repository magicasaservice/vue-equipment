import type { MMenuCardSize } from '../types/menu-card'

/**
 * Every class Mirror v1’s `menu-card.css` reached through a component token,
 * expressed in v2’s generated utilities.
 *
 * The strings are written out in full because Tailwind reads them literally.
 * Never build one by interpolation, and never put two utilities for the same
 * CSS property in the same list: which of the two wins is decided by the order
 * Tailwind emits them in, not by the order they appear on the element. The
 * component composes these maps so exactly one of each reaches the element.
 *
 * The card paints no text colour of its own. v1 put the label, the muted
 * second line and the command colour on the wrappers inside the child, through
 * descendant selectors that also read the card’s hover, selected and disabled
 * state. A utility cannot look up the tree, so all of it stays in the
 * component’s CSS block and no colour utility goes on the child.
 */

/** Shape and motion. Carries no size and no colour. */
export const menuCardBase =
  'm-menu-card box-border inline-flex w-full cursor-pointer items-center justify-start px-1 select-none transition-all duration-100 ease-linear'

/**
 * Vertical padding, gap, radius, minimum height and the type ramp.
 *
 * v1 set the family, weight and line height on the card and the font size on
 * the label wrapper inside it. `type-component-*` carries all four, so the
 * ramp sits on the card and the wrapper inherits it.
 *
 * `md` carries no minimum height because v1’s size loop ran over `xs, sm, lg`
 * only and the base rule set none. It renders the same either way: the child
 * inside already holds the row open to three rem.
 */
export const menuCardSize: Record<MMenuCardSize, string> = {
  xs: 'min-h-8 gap-3.5 py-0.25 rounded-component-sm type-component-xs',
  sm: 'min-h-10 gap-4 py-3 rounded-component-md type-component-sm',
  md: 'gap-4.5 py-3.5 rounded-component-lg type-component-md',
  lg: 'min-h-14 gap-5 py-4 rounded-component-xl type-component-lg',
}

/** The resting background. */
export const menuCardColor =
  'bg-transparent hover:bg-primary-subtle active:bg-primary-subtle-hover'

/**
 * `selected` holds the active colour, and v1 held it through hover too: its
 * `.-selected` rule sat after the `:hover` rule at the same specificity.
 */
export const menuCardSelectedColor =
  'bg-primary-subtle-hover hover:bg-primary-subtle-hover active:bg-primary-subtle-hover'

/** Disabled replaces the resting colour and drops hover and active with it. */
export const menuCardDisabledColor = 'bg-transparent'

/** The child. Its minimum height is the ramp below; the rest is structure. */
export const menuCardChildBase =
  'm-menu-card-child inline-flex items-center transition-all duration-100 ease-linear'

export const menuCardChildSize: Record<MMenuCardSize, string> = {
  xs: 'min-h-8',
  sm: 'min-h-10',
  md: 'min-h-12',
  lg: 'min-h-14',
}
