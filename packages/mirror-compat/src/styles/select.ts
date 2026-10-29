import type { MSelectSize } from '../types/select'

/**
 * Select keeps the same split as Input, for the same reason.
 *
 * Its chrome is an `outline` with a negative offset so the box never grows
 * when the ring appears, and there is no utility family for outline colour.
 * The float-label mechanics on top of it are structural, and the type ramp
 * feeds a `height` as well as a `font-size`, so it has to be a custom property
 * rather than a `type-component-*` class. All of that lives in the component's
 * CSS block, reading the same application variables the utilities read.
 *
 * What is left here is the box: display, size, gap and radius. The size ramp
 * matches Input's to the value, because v1's `select.json` and `input.json`
 * aliased the same application tokens.
 *
 * Cursor is not here either: v2's `Select.Trigger` already paints
 * `cursor: pointer`, and the disabled branch has to beat it from CSS.
 */

/** Shape and motion. Carries no size. */
export const selectBase =
  'm-select relative box-border flex w-full flex-row items-center justify-between select-none transition-all duration-100 ease-linear'

/**
 * v1: `dimension.height` and `dimension.radius` per size. The gap is
 * `dimension.gap.md` at every size, because v1 set it once on the root and its
 * size loop never stepped it, so that is what every v1 instance drew.
 */
export const selectSize: Record<MSelectSize, string> = {
  xs: 'h-8 gap-1.5 rounded-component-sm',
  sm: 'h-10 gap-1.5 rounded-component-md',
  md: 'h-12 gap-1.5 rounded-component-lg',
  lg: 'h-14 gap-1.5 rounded-component-xl',
}
