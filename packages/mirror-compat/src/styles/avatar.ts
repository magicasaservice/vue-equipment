import type { MAvatarMode, MAvatarSize } from '../types/avatar'

/**
 * Mirror v1’s `avatar.css`, in v2’s generated utilities.
 *
 * v1 hardwired the avatar to the primary ramp, so there is no variant here:
 * `mode` alone decides the colour. Apps that pass `variant="secondary"` were
 * writing a plain attribute, not a prop, and v1 ignored it.
 *
 * `image` and a slot that happens to hold an `img` are the same state in v1,
 * and both drop the box: transparent background, no border, clipped corners.
 * The prop is a branch here, and the structural half is a `has-[img]:` variant
 * on the base, whose extra `:has()` beats the resting colour on specificity
 * rather than on the order Tailwind emits it in.
 *
 * The type ramp is not here. `type-component-*` writes `line-height` and no
 * `letter-spacing`, and v1’s avatar wants the Index face at 100% leading with
 * the wide tracking, so the whole type block sits in the component’s CSS.
 */

/**
 * Shape, and the image override for a slot that holds an `img` without the
 * prop. `user-select` comes from the headless part, which sets it already.
 */
export const avatarBase =
  'm-avatar relative flex items-center justify-center has-[img]:overflow-hidden has-[img]:border-0 has-[img]:bg-transparent'

/** v1: `dimension.width.default` and `dimension.height.default`, one value. */
export const avatarSize: Record<MAvatarSize, string> = {
  xs: 'size-8',
  sm: 'size-10',
  md: 'size-12',
  lg: 'size-14',
  xl: 'size-16',
}

/** v1: `dimension.width.inline` and `dimension.height.inline`. */
export const avatarInlineSize: Record<MAvatarSize, string> = {
  xs: 'size-6',
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
  xl: 'size-14',
}

/** v1: `dimension.radius.default`, one step up the app radius ramp per size. */
export const avatarRadius: Record<MAvatarSize, string> = {
  xs: 'rounded-component-sm',
  sm: 'rounded-component-md',
  md: 'rounded-component-lg',
  lg: 'rounded-component-xl',
  xl: 'rounded-component-2xl',
}

/** v1: `dimension.radius.inline`. */
export const avatarInlineRadius: Record<MAvatarSize, string> = {
  xs: 'rounded-component-2xs',
  sm: 'rounded-component-xs',
  md: 'rounded-component-sm',
  lg: 'rounded-component-md',
  xl: 'rounded-component-lg',
}

export const avatarRoundRadius = 'rounded-component-round'

/** The resting colour of every mode, plus v1’s 2px border. */
export const avatarColor: Record<MAvatarMode, string> = {
  solid: 'border-2 border-transparent bg-primary-solid text-primary-on-solid',
  subtle:
    'border-2 border-transparent bg-primary-subtle text-primary-on-subtle',
  outline: 'border-2 border-primary-muted bg-transparent text-primary-solid',
}

/**
 * `image` drops the box and clips the picture. v1 gated the translucent and
 * outline foregrounds on `:not(.-image)`, so an image always falls back to the
 * solid foreground whatever the mode says.
 */
export const avatarImage =
  'overflow-hidden border-0 bg-transparent text-primary-on-solid'
