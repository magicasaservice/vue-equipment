import type { MInputSize } from '../types/input'

/**
 * Input keeps far less in utilities than Button does.
 *
 * Its chrome is an `outline` with a negative offset, so the box never grows
 * when the ring appears, and the generated utilities cover background, text,
 * border and divide colour but not outline colour. The float-label mechanics
 * are structural selectors on top of that. Both live in the component’s CSS
 * block, reading the same application variables the utilities read.
 *
 * What is left here is the box: display, size, gap and radius.
 */

/** Shape and motion. Carries no size. */
export const inputBase =
  'm-input relative box-border flex w-full cursor-text flex-row items-center justify-between select-none transition-all duration-100 ease-linear'

/**
 * v1: `dimension.height` and `dimension.radius` per size. The gap is
 * `dimension.gap.md` at every size, because v1 set it once on the root and its
 * size loop never stepped it, so that is what every v1 instance drew.
 */
export const inputSize: Record<MInputSize, string> = {
  xs: 'h-8 gap-1.5 rounded-component-sm',
  sm: 'h-10 gap-1.5 rounded-component-md',
  md: 'h-12 gap-1.5 rounded-component-lg',
  lg: 'h-14 gap-1.5 rounded-component-xl',
}
