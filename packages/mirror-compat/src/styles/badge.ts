import type { MBadgeMode, MBadgeSize, MBadgeVariant } from '../types/badge'

/**
 * Everything Mirror v1’s `badge.css` reached through a component token and a
 * generated utility can express.
 *
 * The strings are literal because Tailwind reads them as text, and no two of
 * them set the same CSS property: the component branches on `round` and
 * `square` so exactly one radius and one padding reach the element.
 *
 * Badge has no hover and no active state. v1 gave it a resting colour per
 * variant and mode and nothing else, so the colour map is one string deep.
 *
 * The type ramp is not here. `type-component-*` writes `line-height` and no
 * `letter-spacing`, and v1’s badge wants the Index face at 100% leading with
 * the number tracking, so the whole type block sits in the component’s CSS.
 */

/** Shape and the 1px border v1 kept at every size. No colour, no size. */
export const badgeBase =
  'm-badge inline-flex items-center justify-center border select-none'

/** v1: `dimension.height`. */
export const badgeHeight: Record<MBadgeSize, string> = {
  xs: 'h-4',
  sm: 'h-5',
  md: 'h-6',
  lg: 'h-7',
}

/** v1: `dimension.padding`. */
export const badgePadding: Record<MBadgeSize, string> = {
  xs: 'px-1.5',
  sm: 'px-1.75',
  md: 'px-2',
  lg: 'px-2.25',
}

/** `square` trades the padding for a width equal to the height. */
export const badgeSquareWidth: Record<MBadgeSize, string> = {
  xs: 'w-4 px-0',
  sm: 'w-5 px-0',
  md: 'w-6 px-0',
  lg: 'w-7 px-0',
}

/** v1: `dimension.radius`, the compact ramp rather than the default one. */
export const badgeRadius: Record<MBadgeSize, string> = {
  xs: 'rounded-component-compact-sm',
  sm: 'rounded-component-compact-md',
  md: 'rounded-component-compact-lg',
  lg: 'rounded-component-compact-xl',
}

export const badgeRoundRadius = 'rounded-component-round'

/** The resting colour of every variant and mode. */
export const badgeColor: Record<MBadgeVariant, Record<MBadgeMode, string>> = {
  primary: {
    solid: 'border-transparent bg-primary-solid text-primary-on-solid',
    muted: 'border-transparent bg-primary-muted text-primary-on-muted',
    subtle: 'border-transparent bg-primary-subtle text-primary-on-subtle',
    outline: 'border-primary-muted bg-transparent text-primary-solid',
  },
  secondary: {
    solid: 'border-transparent bg-secondary-solid text-secondary-on-solid',
    muted: 'border-transparent bg-secondary-muted text-secondary-on-muted',
    subtle: 'border-transparent bg-secondary-subtle text-secondary-on-subtle',
    outline: 'border-secondary-muted bg-transparent text-secondary-solid',
  },
  accent: {
    solid: 'border-transparent bg-accent-solid text-accent-on-solid',
    muted: 'border-transparent bg-accent-muted text-accent-on-muted',
    subtle: 'border-transparent bg-accent-subtle text-accent-on-subtle',
    outline: 'border-accent-muted bg-transparent text-accent-solid',
  },
  success: {
    solid: 'border-transparent bg-success-solid text-success-on-solid',
    muted: 'border-transparent bg-success-muted text-success-on-muted',
    subtle: 'border-transparent bg-success-subtle text-success-on-subtle',
    outline: 'border-success-muted bg-transparent text-success-solid',
  },
  danger: {
    solid: 'border-transparent bg-danger-solid text-danger-on-solid',
    muted: 'border-transparent bg-danger-muted text-danger-on-muted',
    subtle: 'border-transparent bg-danger-subtle text-danger-on-subtle',
    outline: 'border-danger-muted bg-transparent text-danger-solid',
  },
}
