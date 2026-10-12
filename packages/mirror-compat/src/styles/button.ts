import type { MButtonMode, MButtonSize, MButtonVariant } from '../types/button'

/**
 * Every class Mirror v1’s `button.css` used to reach through a component
 * token, expressed in v2’s generated utilities.
 *
 * The strings are written out in full because Tailwind reads them literally.
 * Never build one by interpolation, and never put two utilities for the same
 * CSS property in the same list: which of the two wins is decided by the order
 * Tailwind emits them in, not by the order they appear on the element. The
 * component composes these maps so exactly one of each reaches the element.
 */

/** Shape, motion and focus. Carries no colour and no size. */
export const buttonBase =
  'm-button relative box-border inline-flex items-center justify-center border-2 outline-4 outline-offset-0 outline-transparent whitespace-nowrap no-underline transition-all duration-100 ease-linear focus-visible:focus-ring'

/** Height, gap and type ramp. v1: `dimension.height.default`, `dimension.gap`, `fontSize.default`. */
export const buttonSize: Record<MButtonSize, string> = {
  xs: 'h-8 gap-0.5 type-component-sm',
  sm: 'h-10 gap-1 type-component-md',
  md: 'h-12 gap-1.5 type-component-lg',
  lg: 'h-14 gap-2 type-component-xl',
}

/** The same for `inline`. v1: `dimension.height.inline`. */
export const buttonInlineSize: Record<MButtonSize, string> = {
  xs: 'h-5 gap-0.5 type-component-sm',
  sm: 'h-7 gap-1 type-component-md',
  md: 'h-9 gap-1.5 type-component-lg',
  lg: 'h-11 gap-2 type-component-xl',
}

/** v1: `dimension.radius.default`, one step up the app radius ramp per size. */
export const buttonRadius: Record<MButtonSize, string> = {
  xs: 'rounded-component-sm',
  sm: 'rounded-component-md',
  md: 'rounded-component-lg',
  lg: 'rounded-component-xl',
}

/** v1: `dimension.radius.inline`. */
export const buttonInlineRadius: Record<MButtonSize, string> = {
  xs: 'rounded-component-2xs',
  sm: 'rounded-component-xs',
  md: 'rounded-component-sm',
  lg: 'rounded-component-md',
}

/** `square` makes the button as wide as it is tall. */
export const buttonSquareWidth: Record<MButtonSize, string> = {
  xs: 'w-8',
  sm: 'w-10',
  md: 'w-12',
  lg: 'w-14',
}

export const buttonInlineSquareWidth: Record<MButtonSize, string> = {
  xs: 'w-5',
  sm: 'w-7',
  md: 'w-9',
  lg: 'w-11',
}

export const buttonRoundRadius = 'rounded-component-round'

export const buttonBlockWidth = 'w-full'

/** The resting colour of every variant and mode. */
export const buttonColor: Record<
  MButtonVariant,
  Record<MButtonMode, string>
> = {
  primary: {
    solid:
      'border-transparent bg-primary-solid text-primary-on-solid hover:bg-primary-solid-hover data-[pressed=true]:bg-primary-solid-active',
    muted:
      'border-transparent bg-primary-muted text-primary-on-muted hover:bg-primary-muted-hover data-[pressed=true]:bg-primary-muted-active',
    subtle:
      'border-transparent bg-primary-subtle text-primary-on-subtle hover:bg-primary-subtle-hover data-[pressed=true]:bg-primary-subtle-active',
    ghost:
      'border-transparent bg-transparent text-primary-on-subtle hover:bg-primary-subtle data-[pressed=true]:bg-primary-subtle-hover',
    outline:
      'bg-transparent border-primary-muted text-primary-solid hover:border-primary-muted-hover data-[pressed=true]:border-primary-muted-active',
    plain:
      'border-transparent bg-transparent text-primary-solid hover:text-primary-solid-hover data-[pressed=true]:text-primary-solid-active',
  },
  secondary: {
    solid:
      'border-transparent bg-secondary-solid text-secondary-on-solid hover:bg-secondary-solid-hover data-[pressed=true]:bg-secondary-solid-active',
    muted:
      'border-transparent bg-secondary-muted text-secondary-on-muted hover:bg-secondary-muted-hover data-[pressed=true]:bg-secondary-muted-active',
    subtle:
      'border-transparent bg-secondary-subtle text-secondary-on-subtle hover:bg-secondary-subtle-hover data-[pressed=true]:bg-secondary-subtle-active',
    ghost:
      'border-transparent bg-transparent text-secondary-on-subtle hover:bg-secondary-subtle data-[pressed=true]:bg-secondary-subtle-hover',
    outline:
      'bg-transparent border-secondary-muted text-secondary-solid hover:border-secondary-muted-hover data-[pressed=true]:border-secondary-muted-active',
    plain:
      'border-transparent bg-transparent text-secondary-solid hover:text-secondary-solid-hover data-[pressed=true]:text-secondary-solid-active',
  },
  accent: {
    solid:
      'border-transparent bg-accent-solid text-accent-on-solid hover:bg-accent-solid-hover data-[pressed=true]:bg-accent-solid-active',
    muted:
      'border-transparent bg-accent-muted text-accent-on-muted hover:bg-accent-muted-hover data-[pressed=true]:bg-accent-muted-active',
    subtle:
      'border-transparent bg-accent-subtle text-accent-on-subtle hover:bg-accent-subtle-hover data-[pressed=true]:bg-accent-subtle-active',
    ghost:
      'border-transparent bg-transparent text-accent-on-subtle hover:bg-accent-subtle data-[pressed=true]:bg-accent-subtle-hover',
    outline:
      'bg-transparent border-accent-muted text-accent-solid hover:border-accent-muted-hover data-[pressed=true]:border-accent-muted-active',
    plain:
      'border-transparent bg-transparent text-accent-solid hover:text-accent-solid-hover data-[pressed=true]:text-accent-solid-active',
  },
  success: {
    solid:
      'border-transparent bg-success-solid text-success-on-solid hover:bg-success-solid-hover data-[pressed=true]:bg-success-solid-active',
    muted:
      'border-transparent bg-success-muted text-success-on-muted hover:bg-success-muted-hover data-[pressed=true]:bg-success-muted-active',
    subtle:
      'border-transparent bg-success-subtle text-success-on-subtle hover:bg-success-subtle-hover data-[pressed=true]:bg-success-subtle-active',
    ghost:
      'border-transparent bg-transparent text-success-on-subtle hover:bg-success-subtle data-[pressed=true]:bg-success-subtle-hover',
    outline:
      'bg-transparent border-success-muted text-success-solid hover:border-success-muted-hover data-[pressed=true]:border-success-muted-active',
    plain:
      'border-transparent bg-transparent text-success-solid hover:text-success-solid-hover data-[pressed=true]:text-success-solid-active',
  },
  danger: {
    solid:
      'border-transparent bg-danger-solid text-danger-on-solid hover:bg-danger-solid-hover data-[pressed=true]:bg-danger-solid-active',
    muted:
      'border-transparent bg-danger-muted text-danger-on-muted hover:bg-danger-muted-hover data-[pressed=true]:bg-danger-muted-active',
    subtle:
      'border-transparent bg-danger-subtle text-danger-on-subtle hover:bg-danger-subtle-hover data-[pressed=true]:bg-danger-subtle-active',
    ghost:
      'border-transparent bg-transparent text-danger-on-subtle hover:bg-danger-subtle data-[pressed=true]:bg-danger-subtle-hover',
    outline:
      'bg-transparent border-danger-muted text-danger-solid hover:border-danger-muted-hover data-[pressed=true]:border-danger-muted-active',
    plain:
      'border-transparent bg-transparent text-danger-solid hover:text-danger-solid-hover data-[pressed=true]:text-danger-solid-active',
  },
}

/** `selected` holds the hover colour while :hover and pressed still apply. */
export const buttonSelectedColor: Record<
  MButtonVariant,
  Record<MButtonMode, string>
> = {
  primary: {
    solid:
      'border-transparent bg-primary-solid-hover text-primary-on-solid hover:bg-primary-solid-hover data-[pressed=true]:bg-primary-solid-active',
    muted:
      'border-transparent bg-primary-muted-hover text-primary-on-muted hover:bg-primary-muted-hover data-[pressed=true]:bg-primary-muted-active',
    subtle:
      'border-transparent bg-primary-subtle-hover text-primary-on-subtle hover:bg-primary-subtle-hover data-[pressed=true]:bg-primary-subtle-active',
    ghost:
      'border-transparent bg-primary-subtle text-primary-on-subtle hover:bg-primary-subtle data-[pressed=true]:bg-primary-subtle-hover',
    outline:
      'bg-transparent border-primary-muted-hover text-primary-solid hover:border-primary-muted-hover data-[pressed=true]:border-primary-muted-active',
    plain:
      'border-transparent bg-transparent text-primary-solid-hover hover:text-primary-solid-hover data-[pressed=true]:text-primary-solid-active',
  },
  secondary: {
    solid:
      'border-transparent bg-secondary-solid-hover text-secondary-on-solid hover:bg-secondary-solid-hover data-[pressed=true]:bg-secondary-solid-active',
    muted:
      'border-transparent bg-secondary-muted-hover text-secondary-on-muted hover:bg-secondary-muted-hover data-[pressed=true]:bg-secondary-muted-active',
    subtle:
      'border-transparent bg-secondary-subtle-hover text-secondary-on-subtle hover:bg-secondary-subtle-hover data-[pressed=true]:bg-secondary-subtle-active',
    ghost:
      'border-transparent bg-secondary-subtle text-secondary-on-subtle hover:bg-secondary-subtle data-[pressed=true]:bg-secondary-subtle-hover',
    outline:
      'bg-transparent border-secondary-muted-hover text-secondary-solid hover:border-secondary-muted-hover data-[pressed=true]:border-secondary-muted-active',
    plain:
      'border-transparent bg-transparent text-secondary-solid-hover hover:text-secondary-solid-hover data-[pressed=true]:text-secondary-solid-active',
  },
  accent: {
    solid:
      'border-transparent bg-accent-solid-hover text-accent-on-solid hover:bg-accent-solid-hover data-[pressed=true]:bg-accent-solid-active',
    muted:
      'border-transparent bg-accent-muted-hover text-accent-on-muted hover:bg-accent-muted-hover data-[pressed=true]:bg-accent-muted-active',
    subtle:
      'border-transparent bg-accent-subtle-hover text-accent-on-subtle hover:bg-accent-subtle-hover data-[pressed=true]:bg-accent-subtle-active',
    ghost:
      'border-transparent bg-accent-subtle text-accent-on-subtle hover:bg-accent-subtle data-[pressed=true]:bg-accent-subtle-hover',
    outline:
      'bg-transparent border-accent-muted-hover text-accent-solid hover:border-accent-muted-hover data-[pressed=true]:border-accent-muted-active',
    plain:
      'border-transparent bg-transparent text-accent-solid-hover hover:text-accent-solid-hover data-[pressed=true]:text-accent-solid-active',
  },
  success: {
    solid:
      'border-transparent bg-success-solid-hover text-success-on-solid hover:bg-success-solid-hover data-[pressed=true]:bg-success-solid-active',
    muted:
      'border-transparent bg-success-muted-hover text-success-on-muted hover:bg-success-muted-hover data-[pressed=true]:bg-success-muted-active',
    subtle:
      'border-transparent bg-success-subtle-hover text-success-on-subtle hover:bg-success-subtle-hover data-[pressed=true]:bg-success-subtle-active',
    ghost:
      'border-transparent bg-success-subtle text-success-on-subtle hover:bg-success-subtle data-[pressed=true]:bg-success-subtle-hover',
    outline:
      'bg-transparent border-success-muted-hover text-success-solid hover:border-success-muted-hover data-[pressed=true]:border-success-muted-active',
    plain:
      'border-transparent bg-transparent text-success-solid-hover hover:text-success-solid-hover data-[pressed=true]:text-success-solid-active',
  },
  danger: {
    solid:
      'border-transparent bg-danger-solid-hover text-danger-on-solid hover:bg-danger-solid-hover data-[pressed=true]:bg-danger-solid-active',
    muted:
      'border-transparent bg-danger-muted-hover text-danger-on-muted hover:bg-danger-muted-hover data-[pressed=true]:bg-danger-muted-active',
    subtle:
      'border-transparent bg-danger-subtle-hover text-danger-on-subtle hover:bg-danger-subtle-hover data-[pressed=true]:bg-danger-subtle-active',
    ghost:
      'border-transparent bg-danger-subtle text-danger-on-subtle hover:bg-danger-subtle data-[pressed=true]:bg-danger-subtle-hover',
    outline:
      'bg-transparent border-danger-muted-hover text-danger-solid hover:border-danger-muted-hover data-[pressed=true]:border-danger-muted-active',
    plain:
      'border-transparent bg-transparent text-danger-solid-hover hover:text-danger-solid-hover data-[pressed=true]:text-danger-solid-active',
  },
}

/** Disabled ignores the variant, exactly as v1’s disabled tokens did. */
export const buttonDisabledColor: Record<MButtonMode, string> = {
  solid: 'border-transparent bg-disabled-solid text-disabled-on-solid',
  muted: 'border-transparent bg-disabled-muted text-disabled-on-muted',
  subtle: 'border-transparent bg-disabled-subtle text-disabled-on-subtle',
  ghost: 'border-transparent bg-transparent text-disabled-on-subtle',
  outline: 'bg-transparent border-disabled-subtle text-disabled-solid',
  plain: 'border-transparent bg-transparent text-disabled-solid',
}
