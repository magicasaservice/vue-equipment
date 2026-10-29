import type { MToggleSize } from '../types/toggle'

/**
 * Toggle splits along the same line Button does, one step down.
 *
 * The track and the handle are two boxes this component renders itself, so
 * their colour is a class list rather than CSS: background, border colour and
 * the focus ring all have generated utilities. Their geometry does not. Every
 * dimension v1 shipped is derived from two others, the track width from the
 * handle width and the inset, so the ramp is a set of custom properties in the
 * CSS block with the arithmetic written once.
 *
 * The label is styled from CSS too, at `.m-toggle > span`, because the `label`
 * slot replaces that element and a class on the default one would not reach a
 * replacement. That is what v1 did.
 *
 * `checked` is a branch in script rather than a `data-[state=on]:` variant.
 * `Toggle.Root` hands the state to its slot, and picking one complete string
 * keeps a single background utility on each box, which is what lets the
 * pressed and focus variants land in the order Tailwind emits them.
 */

/** The box. Carries no size, and `group` anchors the two variants below. */
export const toggleBase = 'm-toggle group relative inline-flex items-center'

/** v1: `dimension.gap`. */
export const toggleGap: Record<MToggleSize, string> = {
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
}

/**
 * Shared by every track: the border box, the resting outline and the ring.
 *
 * The easing is spelled out because v1 wrote `ease`, which is
 * `cubic-bezier(0.25, 0.1, 0.25, 1)` and has no name in the scale.
 */
export const toggleTrackBase =
  'm-toggle__track box-border block h-full w-full rounded-component-round border-2 outline-4 outline-offset-0 outline-transparent transition-all duration-100 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-focus-visible:focus-ring'

/** v1: `color.track.<state>.default`. */
export const toggleTrackColor: Record<'on' | 'off', string> = {
  off: 'border-transparent bg-primary-subtle group-active:bg-primary-subtle-active',
  on: 'border-transparent bg-accent-solid group-active:bg-accent-solid-active',
}

/** v1: `color.track.<state>.disabled`. Replaces the row above, never layers. */
export const toggleTrackDisabledColor: Record<'on' | 'off', string> = {
  off: 'border-transparent bg-disabled-subtle',
  on: 'border-transparent bg-disabled-solid',
}

/** Shared by every handle. */
export const toggleHandleBase =
  'm-toggle__handle box-border rounded-component-round border-2 transition-all duration-100 ease-[cubic-bezier(0.25,0.1,0.25,1)]'

/** v1: `color.handle.<state>.default`. */
export const toggleHandleColor: Record<'on' | 'off', string> = {
  off: 'border-transparent bg-primary-light text-primary-on-light',
  on: 'border-transparent bg-accent-light text-primary-on-light',
}

/** v1: `color.handle.<state>.disabled`. */
export const toggleHandleDisabledColor: Record<'on' | 'off', string> = {
  off: 'border-transparent bg-disabled-light text-disabled-solid',
  on: 'border-transparent bg-disabled-light text-disabled-subtle',
}
